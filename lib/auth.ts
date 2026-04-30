import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  pages: { 
    signIn: "/login-registration", 
  },
  
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter an email and password");
        }
        
        await dbConnect();
        
        // Use type assertion (User as any) if the model still shows red, 
        // but the explicit typing in your models/User.ts is the best fix.
        const user = await (User as any).findOne({ 
          email: credentials.email.toLowerCase() 
        });

        if (!user) {
          throw new Error("No user found with this email");
        }
        
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password, 
          user.password
        );

        if (!isPasswordCorrect) {
          throw new Error("Incorrect password");
        }

        // Returning the object that will be passed to the JWT callback
        return {
          id: String(user._id),
          name: user.name,
          email: user.email,
          role: user.role, 
        };
      },
    }),
  ],
  
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  
  secret: process.env.NEXTAUTH_SECRET,
  
  // Good for debugging errors during development
  debug: process.env.NODE_ENV === "development",
};