import { ReactNode } from "react";

interface AgentOptionsContainer {
    children: ReactNode;
}

export default function AgentOptionsContainer({ children }: AgentOptionsContainer) {
    return <div className="flex w-full h-20 items-center justify-between px-10">{children}</div>
}
