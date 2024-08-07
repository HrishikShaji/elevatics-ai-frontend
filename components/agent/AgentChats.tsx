import React, { memo } from 'react';
import TypedMarkdown from "@/app/(defaults)/search/components/TypedMarkdown";
import { useAccount } from "@/contexts/AccountContext";
import { Chat } from "@/types/types";
import Image from "next/image";
import { SiInternetcomputer } from "react-icons/si";
import SourcesModal from '../SourcesModal';

interface AgentChatsProps {
    chat: Chat;
    disableTyping: boolean;
}

const processMetadata = (metadata: string) => {
    const metadataMatch = metadata.match(/all-text-with-urls: (.+)/);
    if (metadataMatch) {
        const metadataObj = JSON.parse(metadataMatch[1]);
        console.log(metadataObj)
        return metadataObj;
    } else {
        return null
    }
}
const AgentChats = ({ disableTyping, chat }: AgentChatsProps) => {
    const { profile } = useAccount();
    return chat.role === "user" ? (
        <div className='w-full  flex justify-end '>
            <div className='  flex items-center pl-2 gap-2 p-1'>
                <h1 className='bg-gray-200 py-2 px-4 rounded-3xl '>{chat.content}</h1>
                <div className='h-8 w-8 rounded-full bg-blue-500 overflow-hidden'>
                    {profile?.image ? <Image src={profile.image} alt="profile" height={1000} width={1000} className="h-full w-full object-cover" /> : null}
                </div>
            </div>
        </div>
    ) : (
        <div className='w-full justify-start'>
            <div className='  flex gap-2 p-1'>
                <div className='h-8 w-8 flex-shrink-0 rounded-full bg-gray-400 flex items-center justify-center text-black'>
                    <SiInternetcomputer color="white" />
                </div>
                <div className='flex p-4 rounded-3xl bg-gray-200 flex-col'>
                    <div>
                        <TypedMarkdown text={chat.content} disableTyping={disableTyping} />
                    </div>
                    <div className='w-full bg-gray-300 flex justify-end p-2'>
                        <SourcesModal metadata={chat.metadata as string} />
                        <div className='p-1 rounded-xl bg-white text-black ' onClick={() => processMetadata(chat.metadata as string)}>sources</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentChats;
