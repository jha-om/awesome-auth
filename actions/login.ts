"use server"

import * as z from "zod";

import { LoginSchema } from "@/schemas";
import { signIn } from "@/src/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/src/route";
import { AuthError } from "next-auth";

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    const { email, password } = validatedFields.data;

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