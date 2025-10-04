"use server"
import { ResetSchema } from "@/schemas"
import { sendResetPasswordEmail } from "@/src/lib/mail";
import { generatePasswordResetToken } from "@/src/lib/tokens";
import { getUserByEmail } from "@/src/utils/user"
import * as z from "zod";

export const reset = async (value: z.infer<typeof ResetSchema>) => {
    const validatedFields = ResetSchema.safeParse(value);

    if (!validatedFields.success) {
        return { error: "Invalid email!" };
    }

    const { email } = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
        return { error: "No user with this email exists" };
    }

    const passwordResetToken = await generatePasswordResetToken(email);
    await sendResetPasswordEmail(
        passwordResetToken.email,
        passwordResetToken.token,
    );
    return { success: "Reset email sent!" };
}