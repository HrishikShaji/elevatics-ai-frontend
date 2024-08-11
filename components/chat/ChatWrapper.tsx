
import { ReactNode } from "react";

interface ChatWrapperProps {
    children: ReactNode;
}

export default function ChatWrapper({ children }: ChatWrapperProps) {
    return <div className="relative h-screen w-full flex flex-col">{children}</div>
}
