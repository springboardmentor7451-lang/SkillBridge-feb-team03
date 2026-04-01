import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowLeft, UserRound, Globe2, UserPlus } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";

const registerSchema = z
  .object({
    role: z.enum(["volunteer", "ngo"]),
    // Common fields
    email: z.email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
    location: z.string().min(2, "Location is required"),
    // Volunteer fields
    fullName: z.string().optional(),
    skills: z.string().optional(),
    bio: z.string().optional(),
    profilePictureUrl: z.string().optional(),
    // NGO fields
    organizationName: z.string().optional(),
    organizationDescription: z.string().optional(),
    website: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        code: "custom",
        message: "Passwords do not match",
      });
    }

    if (data.role === "volunteer") {
      if (!data.fullName || !data.fullName.trim()) {
        ctx.addIssue({
          path: ["fullName"],
          code: "custom",
          message: "Full Name is required",
        });
      }
      if (!data.skills || !data.skills.trim()) {
        ctx.addIssue({
          path: ["skills"],
          code: "custom",
          message: "Please add at least one skill",
        });
      }
      if (!data.bio || data.bio.trim().length < 10) {
        ctx.addIssue({
          path: ["bio"],
          code: "custom",
          message: "Bio should be at least 10 characters",
        });
      }
    }

    if (data.role === "ngo") {
      if (!data.organizationName || !data.organizationName.trim()) {
        ctx.addIssue({
          path: ["organizationName"],
          code: "custom",
          message: "Organization Name is required",
        });
      }
      if (!data.organizationDescription || data.organizationDescription.trim().length < 10) {
        ctx.addIssue({
          path: ["organizationDescription"],
          code: "custom",
          message: "Organization Description should be at least 10 characters",
        });
      }
    }
  });

export default function Register() {
  const navigate = useNavigate();

  const normalizeCommaInput = (value = "") =>
    String(value)
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .join(", ");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "volunteer",
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      location: "",
      skills: "",
      bio: "",
      profilePictureUrl: "",
      organizationName: "",
      organizationDescription: "",
      website: "",
    },
  });

  const role = watch("role");

  const onSubmit = async (formValues) => {
    try {
      const payload = {
        email: formValues.email,
        password: formValues.password,
        role: formValues.role,
        location: normalizeCommaInput(formValues.location),
        profile_picture_url: formValues.profilePictureUrl,
      };

      // Add role-specific fields
      if (formValues.role === "volunteer") {
        payload.name = formValues.fullName;
        payload.skills = formValues.skills
          ? formValues.skills.split(",").map((item) => item.trim()).filter(Boolean)
          : [];
        payload.bio = formValues.bio;
      } else {
        payload.name = formValues.organizationName;
        payload.organization_name = formValues.organizationName;
        payload.organization_description = formValues.organizationDescription;
        payload.website_url = formValues.website;
      }

      const response = await axios.post("http://localhost:5000/api/auth/register", payload);

      toast.success(response.data?.message || "Account created. Please verify your email.");
      navigate(`/verify-email?email=${encodeURIComponent(formValues.email)}&sent=1`);
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      toast.error(msg);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-orange-50 to-cyan-50 px-4 py-8 sm:px-6">
      <div className="absolute -left-10 top-16 h-44 w-44 rounded-full bg-amber-300/30 blur-3xl" />
      <div className="absolute right-0 top-10 h-56 w-56 rounded-full bg-cyan-300/30 blur-3xl" />

      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-3xl"
        >
          <Link to="/" className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-orange-700">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>

          <Card>
            <CardContent>
              <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="mb-3 inline-flex rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold tracking-wider text-white">SB</div>
                  <h1 className="text-3xl font-bold text-slate-900">Create your account</h1>
                  <p className="mt-2 text-sm text-slate-600">Join SkillBridge and start collaborating with purpose.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <Label>I am signing up as</Label>
                  <Tabs value={role} onValueChange={(value) => setValue("role", value, { shouldValidate: true })}>
                    <TabsList>
                      <TabsTrigger value="volunteer">
                        <UserRound className="mr-1 h-4 w-4" /> Volunteer
                      </TabsTrigger>
                      <TabsTrigger value="ngo">
                        <Globe2 className="mr-1 h-4 w-4" /> NGO
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {role === "volunteer" && (
                  <>
                    {/* VOLUNTEER FORM */}
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        placeholder="Jane Doe"
                        {...register("fullName")}
                      />
                      {errors.fullName && (
                        <p className="text-xs text-rose-600">{errors.fullName.message}</p>
                      )}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="jane@example.com"
                          {...register("email")}
                        />
                        {errors.email && (
                          <p className="text-xs text-rose-600">{errors.email.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          placeholder="e.g., Mumbai, Maharashtra or Remote"
                          {...register("location")}
                        />
                        <p className="text-xs text-slate-500">Use commas to add location parts, like city and state.</p>
                        {errors.location && (
                          <p className="text-xs text-rose-600">{errors.location.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Minimum 8 characters"
                          {...register("password")}
                        />
                        {errors.password && (
                          <p className="text-xs text-rose-600">{errors.password.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Re-enter password"
                          {...register("confirmPassword")}
                        />
                        {errors.confirmPassword && (
                          <p className="text-xs text-rose-600">{errors.confirmPassword.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="profilePictureUrl">Profile Picture URL</Label>
                      <Input
                        id="profilePictureUrl"
                        type="url"
                        placeholder="https://example.com/profile.jpg"
                        {...register("profilePictureUrl")}
                      />
                      <p className="text-xs text-slate-500">Optional. Add a public image URL to show your picture on your profile.</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="skills">Skills</Label>
                      <Input
                        id="skills"
                        placeholder="React, UI Design, Content Writing"
                        {...register("skills")}
                      />
                      {errors.skills && (
                        <p className="text-xs text-rose-600">{errors.skills.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <textarea
                        id="bio"
                        className="min-h-24 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                        placeholder="Tell us a little about yourself"
                        {...register("bio")}
                      />
                      {errors.bio && (
                        <p className="text-xs text-rose-600">{errors.bio.message}</p>
                      )}
                    </div>
                  </>
                )}

                {role === "ngo" && (
                  <>
                    {/* NGO FORM */}
                    <div className="space-y-2">
                      <Label htmlFor="organizationName">Organization Name</Label>
                      <Input
                        id="organizationName"
                        placeholder="Your organization"
                        {...register("organizationName")}
                      />
                      {errors.organizationName && (
                        <p className="text-xs text-rose-600">{errors.organizationName.message}</p>
                      )}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="contact@org.com"
                          {...register("email")}
                        />
                        {errors.email && (
                          <p className="text-xs text-rose-600">{errors.email.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          placeholder="e.g., Mumbai, Maharashtra or Remote"
                          {...register("location")}
                        />
                        <p className="text-xs text-slate-500">Use commas to add location parts, like city and state.</p>
                        {errors.location && (
                          <p className="text-xs text-rose-600">{errors.location.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Minimum 8 characters"
                          {...register("password")}
                        />
                        {errors.password && (
                          <p className="text-xs text-rose-600">{errors.password.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Re-enter password"
                          {...register("confirmPassword")}
                        />
                        {errors.confirmPassword && (
                          <p className="text-xs text-rose-600">{errors.confirmPassword.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="profilePictureUrl">Profile Picture URL</Label>
                      <Input
                        id="profilePictureUrl"
                        type="url"
                        placeholder="https://example.com/profile.jpg"
                        {...register("profilePictureUrl")}
                      />
                      <p className="text-xs text-slate-500">Optional. Add a public image URL to show your picture on your profile.</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="organizationDescription">Organization Description</Label>
                      <textarea
                        id="organizationDescription"
                        className="min-h-24 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                        placeholder="What impact does your organization create?"
                        {...register("organizationDescription")}
                      />
                      {errors.organizationDescription && (
                        <p className="text-xs text-rose-600">{errors.organizationDescription.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        placeholder="https://example.org"
                        {...register("website")}
                      />
                    </div>
                  </>
                )}

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  <UserPlus className="h-4 w-4" />
                  {isSubmitting ? "Creating account..." : "Create Account"}
                </Button>
              </form>

              <p className="mt-5 text-center text-sm text-slate-600">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-orange-700 hover:text-orange-800">
                  Sign in
                </Link>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
