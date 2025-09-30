import LoginButton from "@/components/auth/login-button"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Poppins } from "next/font/google"

const font = Poppins({
  subsets: ["latin"],
  weight: "600",
})

export default function Home() {
  return (
    <main className="h-full flex flex-col justify-center items-center">
      <div className="space-y-6 text-center">
        <h1 className={cn(
          font.className,
          "text-6xl font-semibold text-[#d4a373] drop-shadow-2xl"
        )}>
          aUTH
        </h1>
        <p className="text-lg">
          An awesome authentication service
        </p>
        <div>
          <LoginButton>
            <Button size="lg" className="cursor-pointer">
              Sign in
            </Button>
          </LoginButton>
        </div>
      </div>
    </main>
  )
}
