"use client"

import { UserInfo } from "@/src/components/user-info";
import { useCurrentUser } from "@/src/hooks/use-current-user";

const ServerPage = () => {
    const user = useCurrentUser();
    
    return (
        <UserInfo
            user={user}
            label="Client Component"
        />
    )
}

export default ServerPage;