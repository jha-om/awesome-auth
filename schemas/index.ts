import * as z from "zod"

export const LoginSchema = z.object({
    email: z.email({
        error: "Email is required"
    }),
    password: z.string().min(1, {
        error: "Password is required"
    }),
});

export const ResetSchema = z.object({
    email: z.email({
        error: "Email is required"
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