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
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useState, useTransition } from "react"

export const LoginForm = () => {
    const searchParams = useSearchParams();
    const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
        ? "Email already in use with different provider!"
        : "";
    const [isPending, startTransaction] = useTransition();
    const [showTwoFactor, setShowTwoFactor] = useState(false);
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
            code: ""
        }
    });

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        console.log("the values after submitting it: ", values);
        setError("");
        setSuccess("");

        startTransaction(() => {
            login(values).then((data) => {
                if (data.error) {
                    // form.reset();
                    setError(data.error);
                }

                if (data.success) {
                    form.reset();
                    setSuccess(data.success)
                }

                if (data.twoFactor) {
                    setShowTwoFactor(true);
                }
            })
                .catch(() => setError("Something went wrong"));
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
                            {showTwoFactor && (
                                <FormField
                                    control={form.control}
                                    name="code"
                                    disabled={isPending}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="mx-auto">Two Factor Code</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter your 2FA code"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                            <div className={showTwoFactor ? "hidden" : "space-y-4"}>
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
                                            <Button
                                                size={"sm"}
                                                variant={"link"}
                                                className="px-0 font-normal w-fit underline"
                                                asChild
                                            >
                                                <Link href={'/auth/reset'}>
                                                    Forget password?
                                                </Link>
                                            </Button>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <FormError message={error || urlError} />
                        <FormSuccess message={success} />
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isPending}
                        >
                            {showTwoFactor ? "Confirm" : "Login"}
                        </Button>
                    </form>
                </Form>
            </CardWrapper>
        </div>
    )
}