"use client"

import { CardWrapper } from "@/src/components/auth/card-wrapper"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { login } from "@/actions/login"
import { LoginSchema } from "@/schemas"
import { FormError } from "@/src/components/form-error"
import { FormSuccess } from "@/src/components/form-success"
import { Button } from "@/src/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/src/components/ui/form"
import { Input } from "@/src/components/ui/input"
import { useSearchParams } from "next/navigation"
import { useState, useTransition } from "react"

export const LoginForm = () => {
    const searchParams = useSearchParams();
    const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
        ? "Email already in use with different provider!"
        : "";
    const [isPending, startTransaction] = useTransition();
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    });

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        setError("");
        setSuccess("");
        
        startTransaction(() => {
            login(values).then((data) => {
                setError(data.error);
                setSuccess(data.success)
            })
        })
    }
    return (
        <div>
            <CardWrapper
                headerLabel="Welcome back"
                backButtonLabel="Don't have an account?"
                backButtonHref="/auth/register"
                showSocial
            >
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                disabled={isPending}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter your email"
                                                type="email"
                                                {...field}
                                                />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                            <FormField
                                control={form.control}
                                name="password"
                                disabled={isPending}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter your password"
                                                type="password"
                                                {...field}
                                                />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                        </div>
                        <FormError message={error || urlError} />
                        <FormSuccess message={success} />
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isPending}
                        >
                            Login
                        </Button>
                    </form>
                </Form>
            </CardWrapper>
        </div>
    )
}