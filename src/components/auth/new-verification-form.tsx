"use client"
import { useSearchParams } from "next/navigation"
import { CardWrapper } from "./card-wrapper"
import { SyncLoader } from "react-spinners"
import { useCallback, useEffect, useState } from "react"
import { newVerification } from "@/actions/new-verification"
import { FormError } from "../form-error"
import { FormSuccess } from "../form-success"

export const NewVerificationForm = () => {
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")

    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const onSubmit = useCallback(() => {
        if (!token) {
            setError("Missing token!");
            return;
        }
        newVerification(token)
            .then((data) => {
                setSuccess(data.success);
                setError(data.error);
            })
            .catch(() => {
                setError("Something went wrong!");
            })
    }, [token])

    useEffect(() => {
        onSubmit();
    }, [onSubmit])
    return (
        <CardWrapper
            headerLabel="Confirming your verification"
            backButtonHref="/auth/login"
            backButtonLabel="Back to Login"
        >
            <div className="flex flex-col items-center justify-center">
                {!success && !error && <SyncLoader size={8} color="#588157" />}
                <div className="mt-8">
                    <FormSuccess message={success} />
                    <FormError message={error} />
                </div>
            </div>
        </CardWrapper>

    )
}