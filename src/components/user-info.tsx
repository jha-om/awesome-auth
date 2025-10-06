import { ExtendedUser } from "@/next-auth"
import { Card, CardContent, CardHeader } from "./ui/card";

interface UserInfoProps {
    user?: ExtendedUser;
    label: string;
}
export const UserInfo = ({
    user,
    label,
}: UserInfoProps) => {
    return (
        <Card className="bg-[#faedcd]/60 flex text-center p-4 rounded-xl w-[600px] shadow-sm">
            <CardHeader>
                <p className="text-2xl font-semibold">
                    {label}
                </p>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                    <p className="text-sm font-medium">ID</p>
                    <p className="text-sm max-w-fit bg-[#e0cfa4]/30 font-mono p-1 rounded-md">{user?.id}</p>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                    <p className="text-sm font-medium">Name</p>
                    <p className="text-sm max-w-fit bg-[#e0cfa4]/30 font-mono p-1 rounded-md">{user?.name}</p>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm max-w-fit bg-[#e0cfa4]/30 font-mono p-1 rounded-md">{user?.email}</p>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                    <p className="text-sm font-medium">Role</p>
                    <p className="text-sm max-w-fit bg-[#e0cfa4]/30 font-mono p-1 rounded-md">{user?.role}</p>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                    <p className="text-sm font-medium">2FA</p>
                    <p className={`text-sm text-white max-w-fit ${user?.isTwoFactorEnabled ? "bg-emerald-500" : "bg-red-500"} font-mono p-1 rounded-md`}>{user?.isTwoFactorEnabled ? "ON" : "OFF"}</p>
                </div>
            </CardContent>
        </Card>
    )
}