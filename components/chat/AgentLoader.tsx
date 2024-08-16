

import { SSG_GET_INITIAL_PROPS_CONFLICT } from "next/dist/lib/constants";
import { ReactNode, memo } from "react";
import { SiInternetcomputer } from "react-icons/si";
import Spinner from "../Spinner";

interface AgentLoaderProps {
    isLoading: boolean;
}

const AgentLoader = memo(({ isLoading }: AgentLoaderProps) => {
    return (
        <div className='w-full justify-start'>
            <div className=' w-full flex gap-2 p-1'>
                <div className='h-8 w-8 flex-shrink-0 rounded-full bg-gray-400 flex items-center justify-center text-black'>
                    {isLoading ? <div className="w-6"><Spinner /></div> :
                        <SiInternetcomputer color="white" />}
                </div>
            </div>
        </div>
    )
})

export default AgentLoader
