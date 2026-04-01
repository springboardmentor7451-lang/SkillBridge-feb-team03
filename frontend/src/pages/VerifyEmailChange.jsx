import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { CheckCircle2, RefreshCw, XCircle } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";

const API_BASE = "http://localhost:5000/api/auth";

export default function VerifyEmailChange() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [status, setStatus] = useState(token ? "verifying" : "failed");

  const verifyEmailChange = async () => {
    if (!token) {
      setStatus("failed");
      return;
    }

    try {
      setStatus("verifying");
      const response = await axios.post(`${API_BASE}/verify-email-change`, { token });
      toast.success(response.data?.message || "Email updated successfully");
      setStatus("success");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not verify email update");
      setStatus("failed");
    }
  };

  useEffect(() => {
    verifyEmailChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-sky-50 px-4 py-8 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center justify-center">
        <div className="w-full max-w-md">
          <Card>
            <CardContent>
              <h1 className="mb-4 text-2xl font-bold text-slate-900">Verify New Email</h1>

              {status === "verifying" && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">Verifying your email...</div>
              )}

              {status === "success" && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                    <div className="mb-2 flex items-center gap-2 font-semibold">
                      <CheckCircle2 className="h-4 w-4" /> Email updated
                    </div>
                    Your new email address is verified and active.
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
                    This email verification link is invalid or expired.
                  </div>
                  <Button type="button" variant="secondary" className="w-full" onClick={verifyEmailChange}>
                    <RefreshCw className="h-4 w-4" /> Try Again
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
