import { ReactNode } from "react";

interface AgentLeftOptionsProps {
    children: ReactNode;
}

export default function AgentLeftOptions({ children }: AgentLeftOptionsProps) {
    return <div className=" w-[200px]  top-0 left-0 absolute p-5">{children}</div>
}
