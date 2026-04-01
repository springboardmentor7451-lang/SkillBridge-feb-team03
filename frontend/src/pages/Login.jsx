import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowLeft, LogIn, RefreshCw } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

const loginSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(6, "Password must have at least 6 characters"),
});

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
  const [isResending, setIsResending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", values);

      const { token, user } = res.data;
      login(token, user);
      setUnverifiedEmail("");
      toast.success(`Welcome back, ${user?.name || "there"}!`);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error", err.response || err);
      if (err.response?.data?.code === "EMAIL_NOT_VERIFIED") {
        setUnverifiedEmail(err.response?.data?.email || values.email);
      }
      const msg = err.response?.data?.message || "Login failed";
      toast.error(msg);
    }
  };

  const handleResendVerification = async () => {
    if (!unverifiedEmail) return;

    try {
      setIsResending(true);
      const response = await axios.post("http://localhost:5000/api/auth/resend-verification", {
        email: unverifiedEmail,
      });
      toast.success(response.data?.message || "Verification email sent.");
      navigate(`/verify-email?email=${encodeURIComponent(unverifiedEmail)}`);
    } catch (err) {
      const msg = err.response?.data?.message || "Could not resend verification email";
      toast.error(msg);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-sky-50 px-4 py-8 sm:px-6">
      <div className="absolute -left-10 top-20 h-40 w-40 rounded-full bg-orange-300/30 blur-3xl" />
      <div className="absolute right-0 top-8 h-52 w-52 rounded-full bg-sky-300/30 blur-3xl" />

      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <Link
            to="/"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-orange-700"
          >
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>

          <Card>
            <CardContent>
              <div className="mb-6">
                <div className="mb-4 inline-flex rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold tracking-wider text-white">
                  SB
                </div>
                <h1 className="text-3xl font-bold text-slate-900">Welcome back</h1>
                <p className="mt-2 text-sm text-slate-600">Sign in to continue your impact journey.</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
                  {errors.email && <p className="text-xs text-rose-600">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="Enter your password" {...register("password")} />
                  {errors.password && <p className="text-xs text-rose-600">{errors.password.message}</p>}
                  <div className="pt-1 text-right">
                    <Link to="/forgot-password" className="text-xs font-semibold text-orange-700 hover:text-orange-800">
                      Forgot password?
                    </Link>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  <LogIn className="h-4 w-4" />
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              {unverifiedEmail && (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-sm text-amber-800">Your email is not verified yet.</p>
                  <Button
                    type="button"
                    variant="secondary"
                    className="mt-3 w-full"
                    onClick={handleResendVerification}
                    disabled={isResending}
                  >
                    <RefreshCw className="h-4 w-4" />
                    {isResending ? "Sending..." : "Resend Verification Email"}
                  </Button>
                </div>
              )}

              <p className="mt-5 text-center text-sm text-slate-600">
                New here?{" "}
                <Link to="/register" className="font-semibold text-orange-700 hover:text-orange-800">
                  Create account
                </Link>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}