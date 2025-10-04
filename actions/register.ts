"use server"

import * as z from "zod";

import { RegisterSchema } from "@/schemas";
import { db } from "@/src/lib/db";
import { getUserByEmail } from "@/src/utils/user";
import bcrypt from "bcryptjs";
import { generateVerificationToken } from "@/src/lib/tokens";
import { sendVerificationEmail } from "@/src/lib/mail";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    const { email, name, password } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
        return { error: "Email already exist, use another one" }
    }

    await db.user.create({
        data: {
            email,
            name,
            password: hashedPassword,
        }
    });

    const verificationToken = await generateVerificationToken(email);
    
    await sendVerificationEmail(verificationToken.email, verificationToken.token)
    return {
        success: "Confirmation email sent!",
    };
}