import { ReactNode } from "react";

interface AgentContainerProps {
    children: ReactNode;
}

export default function AgentContainer({ children }: AgentContainerProps) {
    console.log("agent container rendered")
    return <div className="relative h-screen w-full flex flex-col">{children}</div>
}
