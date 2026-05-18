"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, FormEvent } from "react";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 🚀 Redirect logged-in user
  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push("/meet");
    }
  }, [session, status, router]);

  if (status === "loading" || status === "authenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-600 font-medium animate-pulse">
          Redirecting to meet...
        </div>
      </div>
    );
  }

  // ✅ Validators
  const isValidEmail = (email: string): boolean => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const isValidPassword = (password: string): boolean => {
    return /(?=.*[A-Z])(?=.*\d)/.test(password);
  };

  // 🔐 Email login handler
  const handleEmailLogin = async (e: FormEvent<HTMLFormElement>) => {
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
      setError("Password must contain 1 uppercase letter and 1 number");
      return;
    }

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else if (result?.ok) {
        router.push("/meet");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md text-center">
        <h2 className="text-xl font-semibold mb-2">Google Meet</h2>

        <p className="text-gray-500 mb-6">Sign in to continue</p>

        {/* ❌ ERROR MESSAGE */}
        {error && (
          <div className="bg-red-100 text-red-600 text-sm p-2 rounded mb-4">
            {error}
          </div>
        )}

        {/* ================= EMAIL LOGIN ================= */}
        {!session && (
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
        )}

        {/* ================= GOOGLE LOGIN ================= */}
        {!session && (
          <button
            type="button"
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
        {!session && (
          <p className="text-sm text-gray-500 mt-6">
            Don’t have an account?{" "}
            <a href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </a>
          </p>
        )}

        {/* ================= LOGOUT ================= */}
        {session && (
          <div className="mt-4">
            <p className="text-gray-600 mb-3">
              {/* 🔥 TypeScript fix applied here */}
              Signed in as {(session as any).user?.email}
            </p>

            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="bg-red-500 text-white px-4 py-2 rounded-md w-full hover:bg-red-600"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}