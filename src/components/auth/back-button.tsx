"use client"
import Link from "next/link"
import { Button } from "../ui/button"

interface BackButtonProps {
    backButtonLabel: string,
    backButtonHref: string,
}

export const BackButton = ({
    backButtonLabel,
    backButtonHref
}: BackButtonProps) => {
    return (
        <Button
            variant={"link"}
            className="font-normal w-full"
            size={"sm"}
            asChild
        >
            <Link href={backButtonHref}>
                {backButtonLabel}
            </Link>
        </Button>
    )
}