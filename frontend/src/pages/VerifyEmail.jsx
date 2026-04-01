import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Mail, RefreshCw, XCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

const API_BASE = "http://localhost:5000/api/auth";

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const email = params.get("email") || "";
  const token = params.get("token") || "";
  const sent = params.get("sent") === "1";

  const [status, setStatus] = useState(token ? "verifying" : "idle");
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    const verify = async () => {
      if (!token || !email) return;

      try {
        await axios.post(`${API_BASE}/verify-email`, { email, token });
        setStatus("success");
        toast.success("Email verified successfully. You can now sign in.");
      } catch (error) {
        setStatus("failed");
        const message = error.response?.data?.message || "Verification failed";
        toast.error(message);
      }
    };

    verify();
  }, [token, email]);

  const handleResend = async () => {
    if (!email) {
      toast.error("Email is missing. Please register again.");
      return;
    }

    try {
      setResendLoading(true);
      const response = await axios.post(`${API_BASE}/resend-verification`, { email });
      toast.success(response.data?.message || "Verification email sent.");
    } catch (error) {
      const message = error.response?.data?.message || "Could not resend verification email";
      toast.error(message);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-orange-50 to-cyan-50 px-4 py-8 sm:px-6">
      <div className="absolute -left-10 top-20 h-40 w-40 rounded-full bg-orange-300/30 blur-3xl" />
      <div className="absolute right-0 top-8 h-52 w-52 rounded-full bg-sky-300/30 blur-3xl" />

      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-lg"
        >
          <Link
            to="/"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-orange-700"
          >
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>

          <Card>
            <CardContent>
              <div className="mb-6 text-center">
                <div className="mb-4 inline-flex rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold tracking-wider text-white">
                  SB
                </div>
                <h1 className="text-3xl font-bold text-slate-900">Email Verification</h1>
                {email && <p className="mt-2 text-sm text-slate-600">{email}</p>}
              </div>

              {status === "verifying" && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                  Verifying your email...
                </div>
              )}

              {status === "success" && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                    <div className="mb-2 flex items-center gap-2 font-semibold">
                      <CheckCircle2 className="h-4 w-4" /> Email verified
                    </div>
                    Your account is now active. Please sign in to continue.
                  </div>
                  <Button asChild className="w-full">
                    <Link to="/login">Go to Sign In</Link>
                  </Button>
                </div>
              )}

              {status === "failed" && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
                    <div className="mb-2 flex items-center gap-2 font-semibold">
                      <XCircle className="h-4 w-4" /> Verification failed
                    </div>
                    The verification link is invalid or expired.
                  </div>
                  <Button type="button" variant="secondary" className="w-full" onClick={handleResend} disabled={resendLoading}>
                    <RefreshCw className="h-4 w-4" />
                    {resendLoading ? "Sending..." : "Resend Verification Email"}
                  </Button>
                </div>
              )}

              {status === "idle" && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-800">
                    <div className="mb-2 flex items-center gap-2 font-semibold">
                      <Mail className="h-4 w-4" /> Check your inbox
                    </div>
                    {sent
                      ? "Your account was created. We sent a verification link to your email."
                      : "We need to verify your email before you can sign in."}
                  </div>
                  <Button type="button" variant="secondary" className="w-full" onClick={handleResend} disabled={resendLoading}>
                    <RefreshCw className="h-4 w-4" />
                    {resendLoading ? "Sending..." : "Resend Verification Email"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
