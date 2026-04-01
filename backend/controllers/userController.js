const User = require("../models/user");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const EMAIL_CHANGE_TOKEN_TTL_MS = 30 * 60 * 1000;

const normalizeCommaInput = (value = "") =>
  String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .join(", ");

const isSmtpConfigured = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  return Boolean(SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS);
};

const createTransporter = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
};

const sendEmailChangeVerification = async ({ name, newEmail, token }) => {
  const frontendBase = process.env.FRONTEND_URL || "http://localhost:5173";
  const verifyUrl = `${frontendBase}/verify-email-change?token=${token}`;
  const allowDevBypass = process.env.ALLOW_DEV_EMAIL_BYPASS === "true" || process.env.NODE_ENV !== "production";

  if (!isSmtpConfigured() && allowDevBypass) {
    console.log("[EMAIL DEV BYPASS] SMTP is not configured. Open this email-change link manually:");
    console.log(verifyUrl);
    return {
      delivery: "dev-bypass",
      verifyUrl,
    };
  }

  if (!isSmtpConfigured()) {
    throw new Error("Email service is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS.");
  }

  const transporter = createTransporter();
  const sender = process.env.SMTP_FROM || process.env.SMTP_USER;

  await transporter.sendMail({
    from: sender,
    to: newEmail,
    subject: "Verify your new SkillBridge email",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto;">
        <h2 style="color: #0f172a;">Hi ${name},</h2>
        <p style="color: #334155; line-height: 1.6;">
          Confirm this email address to complete your SkillBridge email update.
        </p>
        <p style="margin: 24px 0;">
          <a href="${verifyUrl}" style="background: #0f172a; color: #ffffff; text-decoration: none; padding: 12px 18px; border-radius: 8px; display: inline-block; font-weight: 600;">
            Verify New Email
          </a>
        </p>
        <p style="color: #64748b; font-size: 14px; line-height: 1.6;">
          This link will expire in 30 minutes. If you did not request this change, ignore this email.
        </p>
      </div>
    `,
    text: `Hi ${name}, verify your new SkillBridge email here: ${verifyUrl}. This link expires in 30 minutes.`,
  });

  return {
    delivery: "smtp",
    verifyUrl,
  };
};

// Get logged-in user profile
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
exports.updateMe = async (req, res) => {
  try {
    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fields that can be updated
    const { name, location, bio, skills, organization_name, organization_description, website_url, profile_picture_url } = req.body;

    // Prevent role change
    if (req.body.role) {
      return res.status(400).json({ message: "You cannot change your role" });
    }

    // Update allowed fields. Use undefined checks so users can clear values.
    if (name !== undefined) user.name = name;
    if (location !== undefined) user.location = normalizeCommaInput(location);
    if (profile_picture_url !== undefined) user.profile_picture_url = profile_picture_url;

    // Volunteer fields
    if (user.role === "volunteer") {
      if (bio !== undefined) user.bio = bio;

      if (skills !== undefined) {
        const normalizedSkills = Array.isArray(skills)
          ? skills
          : String(skills)
              .split(",")
              .map((skill) => skill.trim());

        user.skills = normalizedSkills.filter((skill) => skill.length > 0);
      }
    }

    // NGO fields
    if (user.role === "ngo") {
      if (organization_name !== undefined) user.organization_name = organization_name;
      if (organization_description !== undefined) user.organization_description = organization_description;
      if (website_url !== undefined) user.website_url = website_url;
    }

    await user.save();

    const updatedUser = await User.findById(req.user).select("-password");

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current password and new password are required" });
    }

    if (String(newPassword).length < 6) {
      return res.status(400).json({ message: "New password must have at least 6 characters" });
    }

    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.requestEmailChange = async (req, res) => {
  try {
    const { newEmail, currentPassword } = req.body;

    if (!newEmail || !currentPassword) {
      return res.status(400).json({ message: "New email and current password are required" });
    }

    const normalizedNewEmail = newEmail.trim().toLowerCase();
    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (normalizedNewEmail === user.email) {
      return res.status(400).json({ message: "New email must be different from your current email" });
    }

    const existingUser = await User.findOne({ email: normalizedNewEmail });
    if (existingUser) {
      return res.status(400).json({ message: "This email is already in use" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    user.pendingEmail = normalizedNewEmail;
    user.pendingEmailVerificationTokenHash = hashedToken;
    user.pendingEmailVerificationExpires = new Date(Date.now() + EMAIL_CHANGE_TOKEN_TTL_MS);
    await user.save();

    const mailResult = await sendEmailChangeVerification({
      name: user.name,
      newEmail: normalizedNewEmail,
      token: rawToken,
    });

    return res.status(200).json({
      message:
        mailResult?.delivery === "dev-bypass"
          ? "SMTP is not configured. Use the dev verification link from backend logs."
          : "Verification link sent to your new email address.",
      ...(mailResult?.delivery === "dev-bypass" ? { verificationUrl: mailResult.verifyUrl } : {}),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteMe = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(req.user);
    return res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
