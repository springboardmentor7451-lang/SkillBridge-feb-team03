import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { ArrowLeft, Mail } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

const API_BASE = "http://localhost:5000/api/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setSubmitting(true);
      const response = await axios.post(`${API_BASE}/forgot-password`, { email });
      toast.success(response.data?.message || "If the email exists, a reset link has been sent.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not send reset link");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-sky-50 px-4 py-8 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center justify-center">
        <div className="w-full max-w-md">
          <Link
            to="/login"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-orange-700"
          >
            <ArrowLeft className="h-4 w-4" /> Back to sign in
          </Link>

          <Card>
            <CardContent>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Forgot Password</h1>
                <p className="mt-2 text-sm text-slate-600">Enter your email and we will send you a reset link.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={submitting}>
                  <Mail className="h-4 w-4" />
                  {submitting ? "Sending link..." : "Send Reset Link"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
