"use server"

import * as z from "zod";

import { LoginSchema } from "@/schemas";
import { signIn } from "@/src/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/src/route";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/src/utils/user";
import { generateTwoFactorToken, generateVerificationToken } from "@/src/lib/tokens";
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/src/lib/mail";
import { getTwoFactorTokenByEmail } from "@/src/utils/two-factor-token";
import { db } from "@/src/lib/db";
import { getTwoFactorConfirmationByUserId } from "@/src/utils/two-factor-confirmation";

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    const { email, password, code } = validatedFields.data;
    
    console.log(typeof code);
    console.log("code: ", code);
    
    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.password) {
        return { error: "Email does not exist" };
    }

    if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(existingUser.email);
        await sendVerificationEmail(verificationToken.email, verificationToken.token);
        return { success: "Confirmation email sent" };
    }

    if (existingUser.isTwoFactorEnabled && existingUser.email) {
        console.log("YIPEEE! THERE IS A CODE:1 ");
        if (code) {
            console.log("YIPEEE! THERE IS A CODE:2");
            const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

            if (!twoFactorToken) {
                return { error: "Invalid code!" };
            }

            if (twoFactorToken.token !== code) {
                return { error: "Invalid code!" };
            }

            const hasExpired = new Date(twoFactorToken.expires) < new Date();
            if (hasExpired) {
                return { error: "Code expired!" };
            }

            await db.twoFactorToken.delete({
                where: {
                    id: twoFactorToken.id,
                }
            })

            const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

            if (existingConfirmation) {
                await db.twoFactorConfirmation.delete({
                    where: {
                        id: existingConfirmation.id,
                    }
                })
            }

            await db.twoFactorConfirmation.create({
                data: {
                    userId: existingUser.id,
                }
            })


        } else {
            const twoFactorCode = await generateTwoFactorToken(existingUser.email);
            await sendTwoFactorTokenEmail(twoFactorCode.email, twoFactorCode.token);
            return { twoFactor: true }
        }
    }

    try {
        await signIn("credentials", {
            email,
            password,
            // this redirectTo is more explicit because the middleware automatically 
            // checks for the redirection.
            // written here just to add a custom callbackUrl;
            redirectTo: DEFAULT_LOGIN_REDIRECT,
        })
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials" };
                default:
                    return { error: "Something went wrong" };
            }
        }
        // throw error otherwise it will not redirect it.
        throw error;
    }
    return { success: "Logged in successfully" };
}

