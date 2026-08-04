"use client";

import Link from "next/link";
import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import { BACKGROUND, CARD_STYLE, INPUT_STYLE, PRIMARY_BUTTON } from "@/lib/theme";

export default function SignUpPage() {
  const [name, setName] = useState("");
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
          <h1 className="text-2xl font-bold mb-2">Sign up</h1>
          <p className="text-sm text-purple-700/90 mb-6">
            Create an account to save your style and get updates on new sets.
          </p>

          {submitted ? (
            <p className="text-sm font-semibold text-green-800 bg-green-100 border border-green-300 rounded-lg px-4 py-3">
              Thanks! Account creation will be available soon — this is a preview.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block text-sm">
                <span className="font-semibold">Name</span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`mt-1 w-full p-2 rounded-lg ${INPUT_STYLE}`}
                />
              </label>
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
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`mt-1 w-full p-2 rounded-lg ${INPUT_STYLE}`}
                />
              </label>
              <button type="submit" className={`w-full p-2 rounded-lg font-semibold ${PRIMARY_BUTTON}`}>
                Create account
              </button>
            </form>
          )}

          <p className="text-sm text-purple-700 mt-6 text-center">
            Already have an account?{" "}
            <Link href="/auth/sign-in" className="font-semibold text-purple-800 hover:text-purple-600">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
