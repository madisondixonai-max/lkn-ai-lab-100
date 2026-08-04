"use client";

import Link from "next/link";
import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import { BACKGROUND, CARD_STYLE, INPUT_STYLE, PRIMARY_BUTTON } from "@/lib/theme";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className={`min-h-screen ${BACKGROUND} py-10 px-6`}>
      <div className="max-w-md mx-auto">
        <SiteHeader />

        <div className={`${CARD_STYLE} p-6 mt-4`}>
          <h1 className="text-2xl font-bold mb-2">Sign in</h1>
          <p className="text-sm text-purple-700/90 mb-6">
            Welcome back! Sign in to save your favorites and track orders.
          </p>

          {submitted ? (
            <p className="text-sm font-semibold text-green-800 bg-green-100 border border-green-300 rounded-lg px-4 py-3">
              Thanks! Account sign-in will be available soon — this is a preview.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block text-sm">
                <span className="font-semibold">Email</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`mt-1 w-full p-2 rounded-lg ${INPUT_STYLE}`}
                />
              </label>
              <label className="block text-sm">
                <span className="font-semibold">Password</span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`mt-1 w-full p-2 rounded-lg ${INPUT_STYLE}`}
                />
              </label>
              <button type="submit" className={`w-full p-2 rounded-lg font-semibold ${PRIMARY_BUTTON}`}>
                Sign in
              </button>
            </form>
          )}

          <p className="text-sm text-purple-700 mt-6 text-center">
            New here?{" "}
            <Link href="/auth/sign-up" className="font-semibold text-purple-800 hover:text-purple-600">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
