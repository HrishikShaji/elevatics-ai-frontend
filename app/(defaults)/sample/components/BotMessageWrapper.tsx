import { ReactNode, memo } from "react";
import { SiInternetcomputer } from "react-icons/si";

interface AgentMessageWrapperProps {
    children: ReactNode
}

const AgentMessageWrapper = memo(({ children }: AgentMessageWrapperProps) => {
    console.log("agent message rendered")
    return (
        <div className='w-full justify-start'>
            <div className=' w-full flex gap-2 p-1'>
                <div className='h-8 w-8 flex-shrink-0 rounded-full bg-gray-400 flex items-center justify-center text-black'>
                    <SiInternetcomputer color="white" />
                </div>
                <div className='flex w-full p-4 rounded-3xl bg-gray-200 flex-col'>
                    {children}
                </div>
            </div>
        </div>
    )
})

export default AgentMessageWrapper
