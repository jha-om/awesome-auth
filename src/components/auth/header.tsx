import { cn } from "@/src/lib/utils";
import { Poppins } from "next/font/google";

const font = Poppins({
    subsets: ["latin"],
    weight: "600"
})

interface HeaderProps {
    label: string,
}

export const Header = ({ label }: HeaderProps) => {
    return (
        <div className="flex w-full flex-col gap-y-4 items-center justify-center">
            <h1 className={cn(
                "text-3xl font-semibold text-[#d4a373] drop-shadow-2xl",
                font.className
            )}>
                aWESOME aUTH
            </h1>
            <p className="text-muted-foreground text-base">
                {label}
            </p>
        </div>
    )
}