import { db } from "@/src/lib/db";
import { getVerificationTokenByEmail } from "@/src/utils/verification-token";
import { v4 as uuidv4 } from "uuid";
import { getPasswordResetTokenByEmail } from "../utils/password-reset-token";
import crypto from "crypto";
import { getTwoFactorTokenByEmail } from "../utils/two-factor-token";


export const generateVerificationToken = async (email: string) => {
    const token = uuidv4();
    const expiresAt = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getVerificationTokenByEmail(email);

    if (existingToken) {
        await db.verificationToken.delete({
            where: {
                id: existingToken.id,
            }
        })
    }

    const verificationToken = await db.verificationToken.create({
        data: {
            email,
            token,
            expires: expiresAt
        }
    });

    return verificationToken;
}
export const generatePasswordResetToken = async (email: string) => {
    const token = uuidv4();
    const expiresAt = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getPasswordResetTokenByEmail(email);

    if (existingToken) {
        await db.passwordResetToken.delete({
            where: {
                id: existingToken.id,
            }
        })
    }

    const passwordResetToken = await db.passwordResetToken.create({
        data: {
            email,
            token,
            expires: expiresAt
        }
    });

    return passwordResetToken;
}

export const generateTwoFactorToken = async (email: string) => {
    const token = crypto.randomInt(100000, 1000000).toString();
    // changed the expiresAt to 1/2 hour rather than 1 full hour;
    const expiresAt = new Date(new Date().getTime() + 300 * 1000);
    
    const existingToken = await getTwoFactorTokenByEmail(email);

    if (existingToken) {
        await db.twoFactorToken.delete({
            where: {
                id: existingToken.id,
            }
        })
    }

    const twoFactorToken = await db.twoFactorToken.create({
        data: {
            email,
            token,
            expires: expiresAt,
        }
    })
    return twoFactorToken;
}