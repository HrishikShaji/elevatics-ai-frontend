"use client"

import ChatWindow from '@/components/chat/ChatWindow';
import { ChatContext, ChatProvider } from '@/contexts/ChatContext';
import React from 'react';




const Page = () => {
    return (
        <ChatProvider>
            <ChatWindow title='Quick Search' subTitle='Efficient Quick Search' responseType='iresearcher-report' initialChatHistory='' reportId='' disable={false} />
        </ChatProvider>
    )
};

export default Page;
