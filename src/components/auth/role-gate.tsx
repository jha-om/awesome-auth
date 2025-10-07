"use client";

import { useCurrentRole } from "@/src/hooks/use-current-role";
import { UserRole } from "@prisma/client";
import { FormError } from "../form-error";

interface RoleGateProps {
    children: React.ReactNode
    allowedRule: UserRole;
}

export const RoleGate = ({ children, allowedRule }: RoleGateProps) => {
    const role = useCurrentRole();

    if (role !== allowedRule) {
        return (
            <FormError message="You do not have permission to view this content" />
        )
    }
    return (
        <>
            {children}
        </>
    )
}