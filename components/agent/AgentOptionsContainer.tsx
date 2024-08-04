import { ReactNode } from "react";

interface AgentOptionsContainer {
    children: ReactNode;
}

export default function AgentOptionsContainer({ children }: AgentOptionsContainer) {
    return <div className="flex absolute top-0 w-full h-20 items-center justify-between px-10">{children}</div>
}
