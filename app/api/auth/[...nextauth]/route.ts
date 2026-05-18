import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials"; // ✅ 1. Import Credentials

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // ✅ 2. Add the Credentials Provider so NextAuth can handle Email/Password logins
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // 🚨 ATTENTION: Right now, this automatically approves ANY email/password combination for testing.
        // In production, you should replace this logic to check your database (e.g., Prisma/Mongoose).
        if (credentials?.email && credentials?.password) {
          return {
            id: "user-id-123",
            name: "Meet User",
            email: credentials.email,
          };
        }

        // Return null if authentication fails
        return null;
      }
    })
  ],
  
  // ✅ 3. CRITICAL: Credentials login REQUIRES the JWT session strategy to function
  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };