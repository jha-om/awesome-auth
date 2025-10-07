import { UserRole } from "@prisma/client";
import * as z from "zod"

export const LoginSchema = z.object({
    email: z.email({
        error: "Email is required"
    }),
    password: z.string().min(1, {
        error: "Password is required"
    }),
    code: z.optional(z.string()),
});

export const ResetSchema = z.object({
    email: z.email({
        error: "Email is required"
    }),
});

export const NewPasswordSchema = z.object({
    password: z.string().min(6, {
        error: "Password is required"
    }),
});

export const RegisterSchema = z.object({
    email: z.email({
        error: "Email is required"
    }),
    password: z.string().min(6, {
        error: "Minimum 6 characters required"
    }),
    name: z.string().min(3, {
        error: "Name is required",
    }),
})

export const SettingSchema = z.object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
    email: z.optional(z.email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
}).refine((data) => {
    if (data.password && !data.newPassword) {
        return false;
    }

    return true;
}, {
    message: "new password is required",
    path: ["newPassword"]
})
    .refine((data) => {
        if (data.newPassword && !data.password) {
            return false;
        }

        return true;
    }, {
        message: "Pasword is required",
        path: ["password"],
    })