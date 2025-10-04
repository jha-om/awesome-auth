"use server"

import * as z from "zod";

import { LoginSchema } from "@/schemas";
import { signIn } from "@/src/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/src/route";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/src/utils/user";
import { generateVerificationToken } from "@/src/lib/tokens";
import { sendVerificationEmail } from "@/src/lib/mail";

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    const { email, password } = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.password) {
        return { error: "Email does not exist" };
    }

    if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(existingUser.email);
        await sendVerificationEmail(verificationToken.email, verificationToken.token);
        return { success: "Confirmation email sent" };
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