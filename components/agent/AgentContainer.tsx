import { ReactNode } from "react";

interface AgentContainerProps {
    children: ReactNode;
}

export default function AgentContainer({ children }: AgentContainerProps) {
    return <div className="h-screen w-full flex flex-col">{children}</div>
}
