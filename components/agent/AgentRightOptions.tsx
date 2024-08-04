
import { ReactNode } from "react";

interface AgentRightOptionsProps {
    children: ReactNode;
}

export default function AgentRightOptions({ children }: AgentRightOptionsProps) {
    return <div className=" w-[200px] top-0 right-0 absolute p-5">{children}</div>
}
