const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const VERIFICATION_TOKEN_TTL_MS = 30 * 60 * 1000;
const PASSWORD_RESET_TOKEN_TTL_MS = 30 * 60 * 1000;

const isSmtpConfigured = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  return Boolean(SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS);
};

const createVerificationToken = () => {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

  return {
    rawToken,
    hashedToken,
    expiresAt: new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS),
  };
};

const normalizeCommaInput = (value = "") =>
  String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .join(", ");

const buildVerificationUrl = (email, token) => {
  const frontendBase = process.env.FRONTEND_URL || "http://localhost:5173";
  return `${frontendBase}/verify-email?email=${encodeURIComponent(email)}&token=${token}`;
};

const buildPasswordResetUrl = (email, token) => {
  const frontendBase = process.env.FRONTEND_URL || "http://localhost:5173";
  return `${frontendBase}/reset-password?email=${encodeURIComponent(email)}&token=${token}`;
};

const createTransporter = () => {
  if (!isSmtpConfigured()) {
    throw new Error("Email service is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS.");
  }

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

const sendVerificationEmail = async ({ email, name, token }) => {
  const verifyUrl = buildVerificationUrl(email, token);

  const allowDevBypass = process.env.ALLOW_DEV_EMAIL_BYPASS === "true" || process.env.NODE_ENV !== "production";

  if (!isSmtpConfigured() && allowDevBypass) {
    console.log("[EMAIL DEV BYPASS] SMTP is not configured. Open this verification link manually:");
    console.log(verifyUrl);
    return {
      delivery: "dev-bypass",
      verifyUrl,
    };
  }

  const transporter = createTransporter();
  const sender = process.env.SMTP_FROM || process.env.SMTP_USER;

  await transporter.sendMail({
    from: sender,
    to: email,
    subject: "Verify your SkillBridge account",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto;">
        <h2 style="color: #0f172a;">Welcome to SkillBridge, ${name}!</h2>
        <p style="color: #334155; line-height: 1.6;">
          Please verify your email address to activate your account.
        </p>
        <p style="margin: 24px 0;">
          <a href="${verifyUrl}" style="background: #0f172a; color: #ffffff; text-decoration: none; padding: 12px 18px; border-radius: 8px; display: inline-block; font-weight: 600;">
            Verify Email
          </a>
        </p>
        <p style="color: #64748b; font-size: 14px; line-height: 1.6;">
          This link will expire in 30 minutes.
          If you did not create this account, you can ignore this email.
        </p>
      </div>
    `,
    text: `Welcome to SkillBridge, ${name}! Verify your email using this link: ${verifyUrl}. This link expires in 30 minutes.`,
  });

  return {
    delivery: "smtp",
    verifyUrl,
  };
};

const sendPasswordResetEmail = async ({ email, name, token }) => {
  const resetUrl = buildPasswordResetUrl(email, token);
  const allowDevBypass = process.env.ALLOW_DEV_EMAIL_BYPASS === "true" || process.env.NODE_ENV !== "production";

  if (!isSmtpConfigured() && allowDevBypass) {
    console.log("[EMAIL DEV BYPASS] SMTP is not configured. Open this reset link manually:");
    console.log(resetUrl);
    return {
      delivery: "dev-bypass",
      resetUrl,
    };
  }

  const transporter = createTransporter();
  const sender = process.env.SMTP_FROM || process.env.SMTP_USER;

  await transporter.sendMail({
    from: sender,
    to: email,
    subject: "Reset your SkillBridge password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto;">
        <h2 style="color: #0f172a;">Hi ${name},</h2>
        <p style="color: #334155; line-height: 1.6;">
          We received a request to reset your SkillBridge password.
        </p>
        <p style="margin: 24px 0;">
          <a href="${resetUrl}" style="background: #0f172a; color: #ffffff; text-decoration: none; padding: 12px 18px; border-radius: 8px; display: inline-block; font-weight: 600;">
            Reset Password
          </a>
        </p>
        <p style="color: #64748b; font-size: 14px; line-height: 1.6;">
          This link will expire in 30 minutes. If you did not request this, you can ignore this email.
        </p>
      </div>
    `,
    text: `Hi ${name}, reset your password using this link: ${resetUrl}. This link expires in 30 minutes.`,
  });

  return {
    delivery: "smtp",
    resetUrl,
  };
};

// Register user
exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      location,
      profile_picture_url,
      skills,
      bio,
      organization_name,
      organization_description,
      website_url,
    } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role || !location) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Role-specific validation
    if (role === "volunteer") {
      if (!skills || !Array.isArray(skills) || skills.length === 0) {
        return res.status(400).json({ message: "Volunteers must have at least one skill" });
      }
      if (!bio || bio.length < 10) {
        return res.status(400).json({ message: "Bio must be at least 10 characters" });
      }
    }

    if (role === "ngo") {
      if (!organization_name || organization_name.trim().length === 0) {
        return res.status(400).json({ message: "Organization Name is required for NGOs" });
      }
      if (!organization_description || organization_description.trim().length < 10) {
        return res.status(400).json({ message: "Organization Description must be at least 10 characters" });
      }
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedLocation = normalizeCommaInput(location);

    // Check if user exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Prepare user data
    const userData = {
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role,
      location: normalizedLocation,
      profile_picture_url: profile_picture_url || "",
    };

    const { rawToken, hashedToken, expiresAt } = createVerificationToken();
    userData.emailVerificationTokenHash = hashedToken;
    userData.emailVerificationExpires = expiresAt;
    userData.isEmailVerified = false;

    // Add role-specific fields
    if (role === "volunteer") {
      userData.skills = skills;
      userData.bio = bio;
    } else if (role === "ngo") {
      userData.organization_name = organization_name;
      userData.organization_description = organization_description;
      userData.website_url = website_url || "";
    }

    // Create user
    const user = await User.create(userData);

    try {
      const mailResult = await sendVerificationEmail({
        email: user.email,
        name: user.name,
        token: rawToken,
      });

      const isDevBypass = mailResult?.delivery === "dev-bypass";

      return res.status(201).json({
        message: isDevBypass
          ? "Account created. SMTP is not configured, so use the dev verification link from backend logs."
          : "Registration successful. Please verify your email before signing in.",
        requiresEmailVerification: true,
        email: user.email,
        ...(isDevBypass ? { verificationUrl: mailResult.verifyUrl } : {}),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          location: user.location,
          isEmailVerified: user.isEmailVerified,
        },
      });
    } catch (emailError) {
      await User.findByIdAndDelete(user._id);
      return res.status(500).json({
        message: "Could not send verification email. Please try again.",
        error: emailError.message,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    // Check user
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: "Please verify your email before signing in.",
        code: "EMAIL_NOT_VERIFIED",
        email: user.email,
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { email, token } = req.body;

    if (!email || !token) {
      return res.status(400).json({ message: "Email and token are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(400).json({ message: "Invalid verification link" });
    }

    if (user.isEmailVerified) {
      return res.status(200).json({ message: "Email already verified" });
    }

    const hashedIncomingToken = crypto.createHash("sha256").update(token).digest("hex");

    if (
      !user.emailVerificationTokenHash ||
      user.emailVerificationTokenHash !== hashedIncomingToken ||
      !user.emailVerificationExpires ||
      user.emailVerificationExpires.getTime() < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired verification link" });
    }

    user.isEmailVerified = true;
    user.emailVerificationTokenHash = null;
    user.emailVerificationExpires = null;
    await user.save();

    return res.status(200).json({ message: "Email verified successfully. You can now sign in." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(200).json({ message: "If the email exists, a verification link has been sent." });
    }

    if (user.isEmailVerified) {
      return res.status(200).json({ message: "This email is already verified." });
    }

    const { rawToken, hashedToken, expiresAt } = createVerificationToken();
    user.emailVerificationTokenHash = hashedToken;
    user.emailVerificationExpires = expiresAt;
    await user.save();

    const mailResult = await sendVerificationEmail({
      email: user.email,
      name: user.name,
      token: rawToken,
    });

    if (mailResult?.delivery === "dev-bypass") {
      return res.status(200).json({
        message: "SMTP is not configured. Use the dev verification link from backend logs.",
        verificationUrl: mailResult.verifyUrl,
      });
    }

    return res.status(200).json({ message: "Verification email sent. Please check your inbox." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(200).json({ message: "If the email exists, a reset link has been sent." });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    user.passwordResetTokenHash = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + PASSWORD_RESET_TOKEN_TTL_MS);
    await user.save();

    const mailResult = await sendPasswordResetEmail({
      email: user.email,
      name: user.name,
      token: rawToken,
    });

    return res.status(200).json({
      message:
        mailResult?.delivery === "dev-bypass"
          ? "SMTP is not configured. Use the dev reset link from backend logs."
          : "If the email exists, a reset link has been sent.",
      ...(mailResult?.delivery === "dev-bypass" ? { resetUrl: mailResult.resetUrl } : {}),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;

    if (!email || !token || !newPassword) {
      return res.status(400).json({ message: "Email, token and new password are required" });
    }

    if (String(newPassword).length < 6) {
      return res.status(400).json({ message: "Password must have at least 6 characters" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset link" });
    }

    const hashedIncomingToken = crypto.createHash("sha256").update(token).digest("hex");

    if (
      !user.passwordResetTokenHash ||
      user.passwordResetTokenHash !== hashedIncomingToken ||
      !user.passwordResetExpires ||
      user.passwordResetExpires.getTime() < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired reset link" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.passwordResetTokenHash = null;
    user.passwordResetExpires = null;
    await user.save();

    return res.status(200).json({ message: "Password reset successful. You can now sign in." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.verifyEmailChange = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    const hashedIncomingToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      pendingEmailVerificationTokenHash: hashedIncomingToken,
      pendingEmailVerificationExpires: { $gt: new Date() },
    });

    if (!user || !user.pendingEmail) {
      return res.status(400).json({ message: "Invalid or expired email verification link" });
    }

    const emailTakenByAnotherUser = await User.findOne({
      email: user.pendingEmail,
      _id: { $ne: user._id },
    });

    if (emailTakenByAnotherUser) {
      return res.status(400).json({ message: "This email is already in use by another account" });
    }

    user.email = user.pendingEmail;
    user.isEmailVerified = true;
    user.pendingEmail = null;
    user.pendingEmailVerificationTokenHash = null;
    user.pendingEmailVerificationExpires = null;
    await user.save();

    return res.status(200).json({ message: "Email updated successfully." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
