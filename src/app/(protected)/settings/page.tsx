"use client";

import { logout } from "@/actions/logout";
import { Button } from "@/src/components/ui/button";

const SettingsPage = () => {
    // const user = useCurrentUser();

    // instead of using signOut() from next-auth/react
        // write signOut() and import it from next-auth/react
    // we can create signOut using client + server actions
        // pushed code(final code);

    const onClick = () => {
        logout();
    }
    return (
        <div className="bg-[#faedcd]/70 p-10 rounded-xl">
            <div>
                <Button onClick={onClick} type="submit">
                    Sign out
                </Button>
            </div>
        </div>
    )
}

export default SettingsPage;