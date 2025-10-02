"use client"

interface CardWrapperProps {
    children: React.ReactNode,
    headerLabel: string,
    backButtonLabel: string,
    backButtonHref: string,
    showSocial?: boolean,
}

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader
} from "@/src/components/ui/card"
import { Header } from "@/src/components/auth/header"
import { Social } from "@/src/components/auth/social"
import { BackButton } from "@/src/components/auth/back-button"

export const CardWrapper = ({
    children,
    headerLabel,
    backButtonLabel,
    backButtonHref,
    showSocial = false,
}: CardWrapperProps) => {
    return (
        <Card className="w-[400px] shadow-md bg-[#faedcd]/60">
            <CardHeader>
                <Header label={headerLabel} />
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
            {showSocial && (
                <CardFooter>
                    <Social />
                </CardFooter>
            )}
            <CardFooter>
                <BackButton
                    backButtonLabel={backButtonLabel}
                    backButtonHref={backButtonHref}
                >
                </BackButton>
            </CardFooter>
        </Card>
    )
}