"use client";

import { useState } from "react";
import Link from "next/link";
import { auth, isFirebaseConfigured } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Lock, Mail, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    if (!isFirebaseConfigured || !auth) {
      setStatus("error");
      setMessage(
        "Firebase is ready in the codebase, but your Firebase project credentials are not added to .env.local yet. Please configure NEXT_PUBLIC_FIREBASE_API_KEY and NEXT_PUBLIC_FIREBASE_PROJECT_ID."
      );
      return;
    }

    setStatus("loading");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email.trim(),
        formData.password
      );

      setStatus("success");
      const name = userCredential.user.displayName || userCredential.user.email;
      setMessage(`Signed in successfully as ${name}.`);
    } catch (err: unknown) {
      setStatus("error");
      const errCode = (err as { code?: string })?.code;
      if (errCode === "auth/user-not-found" || errCode === "auth/wrong-password" || errCode === "auth/invalid-credential") {
        setMessage("Invalid email or password. Please check your credentials.");
      } else if (errCode === "auth/invalid-email") {
        setMessage("Invalid email address format.");
      } else if (errCode === "auth/too-many-requests") {
        setMessage("Too many failed attempts. Please reset your password or try again later.");
      } else {
        setMessage((err as Error)?.message || "Sign in failed. Please try again.");
      }
    }
  }

  return (
    <div className="py-16 wrap max-w-lg mx-auto space-y-8">
      <div className="text-center space-y-3">
        <span className="text-xs font-black uppercase tracking-widest text-sky-600 bg-sky-50 px-3.5 py-1.5 rounded-full inline-block border border-sky-100">
          Client Portal
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Welcome Back
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
          Sign in to your Jay Axis account to view past quotation requests and manage equipment orders.
        </p>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-10 shadow-xl space-y-6">
        {status === "success" ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 size={36} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Signed In</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
              {message}
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all"
              >
                Browse Shop <ArrowRight size={14} />
              </Link>
              <Link
                href="/quote"
                className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-3 rounded-xl"
              >
                Submit Quotation
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {status === "error" && message && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-xs text-red-700">
                <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{message}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Mail size={14} className="text-sky-600" /> Email Address
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="yourname@gmail.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Lock size={14} className="text-sky-600" /> Password
                </label>
              </div>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-3.5 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {status === "loading" ? "Signing In..." : "Sign In"}
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-500 pt-2">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>Secured by Google Firebase Authentication</span>
            </div>
          </form>
        )}

        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          New to Jay Axis?{" "}
          <Link href="/register" className="font-bold text-sky-600 hover:text-sky-800">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
