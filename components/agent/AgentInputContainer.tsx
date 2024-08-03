import { ReactNode } from "react"

interface AgentInputContainerProps {
    children: ReactNode
}

export default function AgentInputContainer({ children }: AgentInputContainerProps) {
    return <div className="w-full flex justify-center h-20 items-center">{children}</div>
}
