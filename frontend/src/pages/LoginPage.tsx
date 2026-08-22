import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Mail, Lock, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("student@demo.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch {
      setError("Invalid email or password. Try the demo credentials below.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 flex-col justify-between bg-brand-950 p-12 text-white lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500">
            <GraduationCap className="h-7 w-7" />
          </div>
          <span className="text-2xl font-bold">LearnTrack</span>
        </div>
        <div>
          <h2 className="text-4xl font-bold leading-tight">
            Track your learning journey with clarity
          </h2>
          <p className="mt-4 text-lg text-brand-200">
            Monitor progress, visualize insights, and discover your next steps — all in one dashboard.
          </p>
        </div>
        <p className="text-sm text-brand-400">NavGurukul Hackathon — Challenge 4</p>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-brand-600" />
              <span className="text-xl font-bold text-slate-900">LearnTrack</span>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
          <p className="mt-2 text-slate-500">Sign in to access your learning dashboard</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-8 rounded-xl border border-surface-border bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Demo accounts</p>
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              <p>
                <span className="font-medium">Student:</span> student@demo.com / password123
              </p>
              <p>
                <span className="font-medium">Mentor:</span> mentor@demo.com / password123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
