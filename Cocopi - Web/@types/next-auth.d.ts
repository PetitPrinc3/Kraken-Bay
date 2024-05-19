import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            skipPrompt: boolean
        } & DefaultSession["user"]
    }
}