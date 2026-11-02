"use client";

import { useState } from "react";
import Link from "next/link";
import { auth, db, isFirebaseConfigured } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { Lock, Mail, User, Phone, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    if (formData.password.length < 6) {
      setStatus("error");
      setMessage("Password must be at least 6 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setStatus("error");
      setMessage("Passwords do not match. Please re-enter.");
      return;
    }

    if (!isFirebaseConfigured || !auth) {
      setStatus("error");
      setMessage(
        "Firebase is ready in the codebase, but your Firebase project credentials are not added to .env.local yet. Please configure NEXT_PUBLIC_FIREBASE_API_KEY and NEXT_PUBLIC_FIREBASE_PROJECT_ID."
      );
      return;
    }

    setStatus("loading");

    try {
      // 1. Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email.trim(),
        formData.password
      );

      // 2. Set display name
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: formData.name.trim()
        });

        // 3. Save profile to Firestore 'users' collection if Firestore is available
        if (db) {
          try {
            await setDoc(doc(db, "users", userCredential.user.uid), {
              name: formData.name.trim(),
              email: formData.email.trim(),
              phone: formData.phone.trim() || null,
              createdAt: serverTimestamp(),
              role: "client"
            });
          } catch (dbErr) {
            console.warn("Firestore user document write skipped/failed:", dbErr);
          }
        }
      }

      setStatus("success");
      setMessage("Account created successfully! You can now sign in.");
    } catch (err: unknown) {
      setStatus("error");
      const errCode = (err as { code?: string })?.code;
      if (errCode === "auth/email-already-in-use") {
        setMessage("This email address is already registered. Please sign in instead.");
      } else if (errCode === "auth/weak-password") {
        setMessage("The password provided is too weak. Please choose a stronger password.");
      } else if (errCode === "auth/invalid-email") {
        setMessage("The email address format is invalid.");
      } else {
        setMessage((err as Error)?.message || "Registration failed. Please check your details and try again.");
      }
    }
  }

  return (
    <div className="py-16 wrap max-w-xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <span className="text-xs font-black uppercase tracking-widest text-sky-600 bg-sky-50 px-3.5 py-1.5 rounded-full inline-block border border-sky-100">
          Client Portal
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Create an Account
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Join Jay Axis Company to track quotation requests, save project specifications, and access fast engineering support.
        </p>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-10 shadow-xl space-y-6">
        {status === "success" ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 size={36} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Welcome to Jay Axis!</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
              {message}
            </p>
            <div className="pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all"
              >
                Sign In to Your Account <ArrowRight size={14} />
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
                <User size={14} className="text-sky-600" /> Full Name
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g. Eng. David Mwangi"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Phone size={14} className="text-sky-600" /> Phone Number
                </label>
                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+254 700 000 000"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Lock size={14} className="text-sky-600" /> Password
                </label>
                <input
                  name="password"
                  type="password"
                  minLength={6}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="At least 6 characters"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Lock size={14} className="text-sky-600" /> Confirm Password
                </label>
                <input
                  name="confirmPassword"
                  type="password"
                  minLength={6}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Re-enter password"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-3.5 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {status === "loading" ? "Creating Account..." : "Create Account"}
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-500 pt-2">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>Secured by Google Firebase Authentication</span>
            </div>
          </form>
        )}

        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          Already registered?{" "}
          <Link href="/login" className="font-bold text-sky-600 hover:text-sky-800">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}
