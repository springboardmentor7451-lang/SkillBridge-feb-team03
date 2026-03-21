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
    name: z.string().min(2, "Name is required"),
    email: z.email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
    location: z.string().min(2, "Location is required"),
    skills: z.string().optional(),
    bio: z.string().min(10, "Bio should be at least 10 characters"),
    organization_name: z.string().optional(),
    organization_description: z.string().optional(),
    website_url: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        code: "custom",
        message: "Passwords do not match",
      });
    }

    if (data.role === "volunteer" && (!data.skills || !data.skills.trim())) {
      ctx.addIssue({
        path: ["skills"],
        code: "custom",
        message: "Please add at least one skill",
      });
    }

    if (data.role === "ngo") {
      if (!data.organization_name || !data.organization_name.trim()) {
        ctx.addIssue({
          path: ["organization_name"],
          code: "custom",
          message: "Organization name is required for NGO accounts",
        });
      }
      if (!data.organization_description || data.organization_description.trim().length < 20) {
        ctx.addIssue({
          path: ["organization_description"],
          code: "custom",
          message: "Description should be at least 20 characters",
        });
      }
    }
  });

export default function Register() {
  const navigate = useNavigate();

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
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      location: "",
      skills: "",
      bio: "",
      organization_name: "",
      organization_description: "",
      website_url: "",
    },
  });

  const role = watch("role");

  const onSubmit = async (formValues) => {
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name: formValues.name,
        email: formValues.email,
        password: formValues.password,
        role: formValues.role,
        location: formValues.location,
        skills: formValues.skills ? formValues.skills.split(",").map((item) => item.trim()).filter(Boolean) : [],
        bio: formValues.bio,
        organization_name: formValues.organization_name,
        organization_description: formValues.organization_description,
        website_url: formValues.website_url,
      });

      toast.success("Account created successfully. Please sign in.");
      navigate("/login");
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

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Jane Doe" {...register("name")} />
                    {errors.name && <p className="text-xs text-rose-600">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="jane@example.com" {...register("email")} />
                    {errors.email && <p className="text-xs text-rose-600">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" placeholder="Minimum 8 characters" {...register("password")} />
                    {errors.password && <p className="text-xs text-rose-600">{errors.password.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input id="confirmPassword" type="password" placeholder="Re-enter password" {...register("confirmPassword")} />
                    {errors.confirmPassword && <p className="text-xs text-rose-600">{errors.confirmPassword.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" placeholder="e.g., Delhi or Remote" {...register("location")} />
                  {errors.location && <p className="text-xs text-rose-600">{errors.location.message}</p>}
                </div>

                {role === "volunteer" ? (
                  <div className="space-y-2">
                    <Label htmlFor="skills">Skills</Label>
                    <Input id="skills" placeholder="React, UI Design, Content Writing" {...register("skills")} />
                    {errors.skills && <p className="text-xs text-rose-600">{errors.skills.message}</p>}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="organization_name">Organization Name</Label>
                        <Input id="organization_name" placeholder="Your organization" {...register("organization_name")} />
                        {errors.organization_name && <p className="text-xs text-rose-600">{errors.organization_name.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="organization_description">Organization Description</Label>
                        <textarea
                          id="organization_description"
                          className="min-h-24 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                          placeholder="What impact does your organization create?"
                          {...register("organization_description")}
                        />
                        {errors.organization_description && <p className="text-xs text-rose-600">{errors.organization_description.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website_url">Website</Label>
                        <Input id="website_url" placeholder="https://example.org" {...register("website_url")} />
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    className="min-h-24 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                    placeholder="Tell us a little about yourself or your mission"
                    {...register("bio")}
                  />
                  {errors.bio && <p className="text-xs text-rose-600">{errors.bio.message}</p>}
                </div>

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
