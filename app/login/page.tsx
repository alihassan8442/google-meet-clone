"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ error state
  const [error, setError] = useState("");

  // 🚀 Redirect logged-in user
  useEffect(() => {
    if (session) {
      router.push("/meet");
    }
  }, [session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // ✅ validators
  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const isValidPassword = (password) => {
    // at least 1 uppercase + 1 number
    return /(?=.*[A-Z])(?=.*\d)/.test(password);
  };

  // 🔐 Email login
  const handleEmailLogin = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Enter a valid email address");
      return;
    }

    if (!isValidPassword(password)) {
      setError(
        "Password must contain 1 uppercase letter and 1 number"
      );
      return;
    }

    // ✅ success → go to meet
    router.push("/meet");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md text-center">

        <h2 className="text-xl font-semibold mb-2">
          Google Meet
        </h2>

        <p className="text-gray-500 mb-6">
          Sign in to continue
        </p>

        {/* ❌ ERROR MESSAGE */}
        {error && (
          <div className="bg-red-100 text-red-600 text-sm p-2 rounded mb-4">
            {error}
          </div>
        )}

        {/* ================= EMAIL LOGIN ================= */}
        <form onSubmit={handleEmailLogin} className="space-y-3 mb-6">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded-md outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded-md outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-md w-full hover:bg-green-700"
          >
            Login with Email
          </button>

        </form>

        {/* ================= GOOGLE LOGIN ================= */}
        {!session && (
          <button
            onClick={() =>
              signIn("google", {
                callbackUrl: "/meet",
                prompt: "select_account",
              })
            }
            className="bg-blue-600 text-white px-4 py-2 rounded-md w-full hover:bg-blue-700"
          >
            Continue with Google
          </button>
        )}

        {/* ================= SIGNUP ================= */}
        <p className="text-sm text-gray-500 mt-6">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>

        {/* ================= LOGOUT ================= */}
        {session && (
          <div className="mt-4">
            <p className="text-gray-600 mb-3">
              Signed in as {session.user?.email}
            </p>

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="bg-red-500 text-white px-4 py-2 rounded-md w-full"
            >
              Sign out
            </button>
          </div>
        )}

      </div>
    </div>
  );
}