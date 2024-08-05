import React, { memo } from 'react';
import TypedMarkdown from "@/app/(defaults)/search/components/TypedMarkdown";
import { useAccount } from "@/contexts/AccountContext";
import { Chat } from "@/types/types";
import Image from "next/image";
import { SiInternetcomputer } from "react-icons/si";

interface AgentChatsProps {
    chat: Chat;
    disableTyping: boolean;
}

const AgentChats = ({ disableTyping, chat }: AgentChatsProps) => {
    const { profile } = useAccount()

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
                    <TypedMarkdown text={chat.content} disableTyping={disableTyping} />
                </div>
            </div>
        </div>
    );
};

export default AgentChats;
