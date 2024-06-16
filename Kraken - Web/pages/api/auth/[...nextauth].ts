import NextAuth, { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcrypt";
import prismadb from "@/lib/prismadb";
import { User } from "@prisma/client"
import { signOut } from "next-auth/react";

export const authOptions: AuthOptions = {
    providers: [
        Credentials({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "text",
                },
                password: {
                    label: "Password",
                    type: "passord",
                },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error(JSON.stringify("Email and password required."));
                }

                const user = await prismadb.user.findUnique({
                    where: {
                        email: credentials.email,
                    },
                });

                if (!user || !user.hashedPassword) {
                    throw new Error("Email does not exist.");
                }

                const isCorrectPassword = await compare(
                    credentials.password,
                    user.hashedPassword
                );

                if (!isCorrectPassword) {
                    throw new Error("Incorrect password.");
                }

                if (user.roles == "") {
                    throw new Error("Account validation pending.")
                }

                return user;
            },
        }),
    ],
    pages: {
        signIn: "/auth",
    },
    debug: process.env.NODE_ENV === "development",
    adapter: PrismaAdapter(prismadb),
    session: { strategy: "jwt" },
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.skipPrompt = (user as User).skipPrompt
                token.roles = (user as User).roles
            }
            return token
        },
        session({ session, token }) {
            if (session.user) {
                session.user.skipPrompt = (token.skipPrompt as boolean)
                session.user.roles = (token.roles as string)
            }
            return session
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);