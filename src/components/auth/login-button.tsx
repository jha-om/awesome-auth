"use client"

import { useRouter } from "next/navigation"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/src/components/ui/dialog"
import { LoginForm } from "@/src/components/auth/login-form";
import { DialogTitle } from "@radix-ui/react-dialog";
interface LoginButtonProps {
    children: React.ReactNode,
    mode?: "modal" | "redirect",
    asChild?: boolean,
}

const LoginButton = ({
    children,
    mode = "redirect",
    asChild
}: LoginButtonProps) => {
    const router = useRouter();

    const onClick = () => {
        router.push('/auth/login');
    }

    if (mode === "modal") {
        return (
            <Dialog>
                <DialogTrigger asChild={asChild}>
                    {children}
                </DialogTrigger>
                <DialogTitle />
                <DialogContent className="p-0 w-auto border-none">
                    <LoginForm />
                </DialogContent>
            </Dialog>
            
        )
    }
    return (
        <span
            onClick={onClick}
            className="cursor-pointer">
            {children}
        </span>
    )
}

export default LoginButton