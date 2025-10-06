"use client"

import { LogOutIcon, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { useCurrentUser } from "@/src/hooks/use-current-user"
import { LogoutButton } from "./logout-button"
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu"

export const UserButton = () => {
    const user = useCurrentUser();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar>
                    <AvatarImage src={user?.image || ""} />
                    <AvatarFallback className="bg-[#e0cfa4]">
                        <User size={24} absoluteStrokeWidth />
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-40 p-2" align="end">
                <LogoutButton>
                    <DropdownMenuItem className="flex justify-between items-center border-none">
                        Logout
                        <LogOutIcon size={16} />
                    </DropdownMenuItem>
                </LogoutButton>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}