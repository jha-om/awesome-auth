import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth, { DefaultSession } from "next-auth"
import { } from "next-auth/jwt"
import authConfig from "@/src/auth.config"

import { db } from "@/src/lib/db"
import { getUserById } from "@/src/utils/user"
import { UserRole } from "@prisma/client"

declare module "next-auth" {
    interface Session {
        user: {
            role: UserRole
        } & DefaultSession["user"]
    }
    
}

declare module "next-auth/jwt" {
    interface JWT {
        role?: UserRole
    }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
    pages: {
        signIn: '/auth/login',
        error: '/auth/error',
    },
    events: {
        async linkAccount({ user }) {
            await db.user.update({
                where: {
                    id: user.id
                }, data: {
                    emailVerified: new Date(),
                }
            })
        }
    },
    callbacks: {
        async session({ token, session }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }

            if (token.role && session.user) {
                session.user.role = token.role;
            }
            return session;
        },
        async jwt({ token }) {
            if (!token.sub) {
                return token;
            }

            const existingUser = await getUserById(token.sub);

            if (!existingUser) {
                return token;
            }

            token.role = existingUser.role;
            return token;
        }
    },
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    ...authConfig,
})