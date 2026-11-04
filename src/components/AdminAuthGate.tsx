"use client";

import { useEffect, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import {
  getIdTokenResult,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase";
import { AlertCircle, LoaderCircle, LockKeyhole, LogOut, Mail, ShieldCheck } from "lucide-react";

type AuthStatus = "checking" | "signed-out" | "authorized";

function getSignInErrorMessage(error: unknown) {
  const code = (error as { code?: string })?.code;

  if (
    code === "auth/invalid-credential" ||
    code === "auth/user-not-found" ||
    code === "auth/wrong-password"
  ) {
    return "The email address or password is incorrect.";
  }
  if (code === "auth/invalid-email") return "Enter a valid email address.";
  if (code === "auth/too-many-requests") return "Too many attempts. Please wait before trying again.";
  if (code === "auth/operation-not-allowed") return "Email and password sign-in is not enabled for this Firebase project.";
  if (code === "auth/network-request-failed") return "Firebase could not be reached. Check your connection and try again.";

  return "Sign-in failed. Check your credentials and try again.";
}

export function AdminAuthGate({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("checking");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!active) return;

      if (!user) {
        setAdminEmail("");
        setStatus("signed-out");
        return;
      }

      setStatus("checking");

      try {
        const tokenResult = await getIdTokenResult(user, true);
        if (!active) return;

        if (tokenResult.claims.admin !== true) {
          setErrorMessage("This Firebase account is not authorized to access the admin dashboard.");
          setStatus("signed-out");
          await signOut(auth).catch(() => undefined);
          return;
        }

        setAdminEmail(user.email || "Administrator");
        setErrorMessage("");
        setStatus("authorized");
      } catch {
        if (!active) return;
        setErrorMessage("Firebase could not verify administrator access. Please sign in again.");
        setStatus("signed-out");
        await signOut(auth).catch(() => undefined);
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    if (!isFirebaseConfigured) {
      setErrorMessage("Firebase Authentication is not configured for this application.");
      return;
    }

    setIsSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      setPassword("");
    } catch (error: unknown) {
      setStatus("signed-out");
      setErrorMessage(getSignInErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSignOut() {
    setStatus("checking");
    try {
      await signOut(auth);
    } catch {
      setErrorMessage("Could not sign out. Please try again.");
      setStatus("authorized");
    }
  }

  if (status === "checking") {
    return (
      <main className="wrap flex min-h-[50vh] items-center justify-center py-12">
        <div role="status" className="flex items-center gap-3 text-sm font-semibold text-slate-600">
          <LoaderCircle size={20} className="animate-spin text-sky-600" />
          Verifying administrator access...
        </div>
      </main>
    );
  }

  if (status === "authorized") {
    return (
      <>
        <div className="wrap flex flex-col gap-3 border-b border-slate-100 py-3 sm:flex-row sm:items-center sm:justify-end">
          <span className="text-xs text-slate-500">Signed in as <strong className="text-slate-800">{adminEmail}</strong></span>
          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 self-start rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50 sm:self-auto"
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>
        {children}
      </>
    );
  }

  return (
    <main className="wrap mx-auto max-w-xl py-12 sm:py-16">
      <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:p-9">
        <div className="space-y-3 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
            <ShieldCheck size={24} />
          </div>
          <p className="text-[11px] font-bold uppercase text-sky-700">Restricted Area</p>
          <h1 className="text-2xl font-black text-slate-900">Administrator Sign In</h1>
          <p className="text-sm text-slate-500">Sign in with your authorized Firebase administrator account.</p>
        </div>

        {errorMessage && (
          <div role="alert" className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="admin-email" className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <Mail size={14} className="text-sky-600" /> Email address
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition-colors focus:border-sky-500"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="admin-password" className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <LockKeyhole size={14} className="text-sky-600" /> Password
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition-colors focus:border-sky-500"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isSubmitting ? <LoaderCircle size={17} className="animate-spin" /> : <LockKeyhole size={16} />}
            {isSubmitting ? "Signing in..." : "Sign in to admin"}
          </button>
        </form>

        <div className="flex items-center justify-center gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
          <ShieldCheck size={15} className="text-emerald-600" />
          Protected by Firebase Authentication
        </div>
      </section>
    </main>
  );
}