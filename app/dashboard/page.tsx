"use client";

import { useSession, signOut } from "next-auth/react";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session) {
    return <div className="min-h-screen flex items-center justify-center">Not logged in</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md text-center">

        <h1 className="text-2xl font-bold mb-2">
          Welcome to Dashboard
        </h1>

        <p className="text-gray-600">
          {session.user?.name}
        </p>

        <p className="text-gray-500 mb-6">
          {session.user?.email}
        </p>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="bg-red-500 text-white px-4 py-2 rounded-md"
        >
          Sign out
        </button>

      </div>
    </div>
  );
}