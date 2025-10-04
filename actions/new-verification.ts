"use server";

import { db } from "@/src/lib/db";
import { getUserByEmail } from "@/src/utils/user";
import { getVerificationTokenByToken } from "@/src/utils/verification-token";

export const newVerification = async (token: string) => {
    const existingToken = await getVerificationTokenByToken(token);

    if (!existingToken) {
        return { error: "Token does not exist" };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
        return { error: "Token has expired!" };
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if (!existingUser) {
        return { error: "Email does not exist" };
    }
    
    await db.user.update({
        where: {
            id: existingUser.id
        },
        data: {
            emailVerified: new Date(),
            // why this email is also updated?
            // because let's say user wants to update their existing email, 
            // so they enter a new email before updating the new email, 
            // we should send the verification email to verify the new email,
            // then after verification we should update the new email into our db;
            email: existingToken.email
        }
    })

    await db.verificationToken.delete({
        where: {
            id: existingToken.id
        }
    })

    return { success: "Email verified!" };
}