import authConfig from "@/src/auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth from "next-auth"
import { } from "next-auth/jwt"

import { db } from "@/src/lib/db"
import { getUserById } from "@/src/utils/user"
import { getTwoFactorConfirmationByUserId } from "./utils/two-factor-confirmation"

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
        async signIn({ user, account }) {
            if (account?.provider !== "credentials") {
                return true;
            }
            const existingUser = await getUserById(user.id as string);

            if (!existingUser?.emailVerified) {
                return false;
            }

            if (existingUser.isTwoFactorEnabled) {
                const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
                
                if (!twoFactorConfirmation) {
                    return false;
                }

                // deleting 2fa confirmation everytime, and prompting to do 2fa on every login;
                await db.twoFactorConfirmation.delete({
                    where: {
                        id: twoFactorConfirmation.id
                    }
                })
            }

            return true;
        },
        async session({ token, session }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }

            if (token.role && session.user) {
                session.user.role = token.role;
            }
            if (session.user) {
                session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean; 
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
            token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
            return token;
        }
    },
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    ...authConfig,
})