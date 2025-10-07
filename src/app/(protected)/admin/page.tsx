"use client";

import { admin } from "@/actions/admin";
import { RoleGate } from "@/src/components/auth/role-gate";
import { FormSuccess } from "@/src/components/form-success";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { UserRole } from "@prisma/client";
import { toast } from "sonner";

const AdminPage = () => {
    const onServerActionClick = () => {
        admin()
            .then((data) => {
                if (data.error) {
                    toast.error("FORBIDDEN");
                }
                if (data.success) {
                    toast.success(data.success)
                }
            })
    }

    const onApiRouteClick = () => {
        fetch("/api/admin")
            .then((response) => {
                if (response.ok) {
                    toast.success("TESTED API ROUTE ADMIN ONLY!!")
                } else {
                    toast.error("FORBIDDEN");
                }
            })
    } 
    return (
        <Card className="bg-[#faedcd]/60 flex text-center p-4 rounded-xl w-[600px] shadow-sm">
            <CardHeader>
                <p className="text-2xl font-semibold">
                    Admin
                </p>
            </CardHeader>
            <CardContent className="space-y-4">
                    <RoleGate allowedRule={UserRole.ADMIN} >
                        <FormSuccess 
                            message="You are allowed to see this content"
                        />
                </RoleGate>
                <div className="flex items-center justify-between rounded-lg border p-3 shadow-md">
                    <p className="text-sm font-medium">
                        Admin-only API route
                    </p>
                    <Button onClick={onApiRouteClick}>
                        click to test
                    </Button>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3 shadow-md">
                    <p className="text-sm font-medium">
                        Admin-only Server Action
                    </p>
                    <Button onClick={onServerActionClick}>
                        click to test
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default AdminPage;