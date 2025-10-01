import { CircleCheckBigIcon } from "lucide-react";

interface FormSuccessProps {
    message?: string;
}
export const FormSuccess = ({
    message
}: FormSuccessProps) => {
    if (!message) {
        return null;
    }

    return (
        <div className="bg-[#588157]/20 p-2 rounded-md flex items-center gap-x-2 text-sm text-[#3a5a40]">
            <CircleCheckBigIcon className="w-4 h-4" />
            <p>{message}</p>
        </div>
    )
}