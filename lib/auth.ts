import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        phone: { label: "Phone", type: "text" },
        otp: { label: "OTP", type: "text" },
        isOtpLogin: { label: "isOtpLogin", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        // 1. Phone OTP Mock Flow
        if (credentials.isOtpLogin === "true") {
          const { phone, otp } = credentials;
          if (!phone) throw new Error("Phone number is required");
          // Accept mock OTP 123456 or any 6-digit in dev
          if (otp !== "123456") {
            throw new Error("Invalid OTP code. Use demo code: 123456");
          }

          let user = await db.user.findFirst({
            where: { phone },
          });

          if (!user) {
            // Auto-register customer via phone
            user = await db.user.create({
              data: {
                name: `Guest (${phone.slice(-4)})`,
                email: `phone_${Date.now()}@beem.test`,
                phone,
                role: "CUSTOMER",
              },
            });
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            loyaltyPoints: user.loyaltyPoints,
          };
        }

        // 2. Email & Password Flow
        const { email, password } = credentials;
        if (!email || !password) {
          throw new Error("Email and password are required");
        }

        const user = await db.user.findUnique({
          where: { email: email.toLowerCase().trim() },
        });

        if (!user || !user.passwordHash) {
          throw new Error("No account found with this email");
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
          throw new Error("Incorrect password");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          loyaltyPoints: user.loyaltyPoints,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "CUSTOMER";
        token.phone = (user as any).phone;
        token.loyaltyPoints = (user as any).loyaltyPoints || 0;
      }
      if (trigger === "update" && session) {
        if (session.loyaltyPoints !== undefined) token.loyaltyPoints = session.loyaltyPoints;
        if (session.name) token.name = session.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;
        (session.user as any).phone = token.phone as string;
        (session.user as any).loyaltyPoints = token.loyaltyPoints as number;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "beem-beauty-empire-super-secret-key-2026-secure",
};
