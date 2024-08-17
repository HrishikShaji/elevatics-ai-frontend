
import { SSG_GET_INITIAL_PROPS_CONFLICT } from "next/dist/lib/constants";
import { ReactNode, memo } from "react";
import { SiInternetcomputer } from "react-icons/si";
import Spinner from "../Spinner";

interface ChatMessageAgentWrapperProps {
    children: ReactNode
    isLoading: boolean;
}

const ChatMessageAgentWrapper = memo(({ isLoading, children, }: ChatMessageAgentWrapperProps) => {
    return (
        <div className='max-w-[900px] justify-start'>
            <div className=' w-full flex gap-2 p-1'>
                <div className='h-8 w-8 flex-shrink-0 rounded-full bg-gray-400 flex items-center justify-center text-black'>
                    {isLoading ? <div className="w-6"><Spinner /></div> :
                        <SiInternetcomputer color="white" />}
                </div>
                <div className='flex w-full p-10 rounded-3xl bg-gray-200 flex-col'>
                    {children}
                </div>
            </div>
        </div>
    )
})

export default ChatMessageAgentWrapper
