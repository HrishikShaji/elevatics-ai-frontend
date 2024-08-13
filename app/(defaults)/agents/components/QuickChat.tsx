


"use client"

import ChatWindow from "@/components/chat/ChatWindow"
import { ChatProvider } from "@/contexts/ChatContext"

export default function QuickChat() {
    return <ChatProvider>
        <ChatWindow title='Quick search' subTitle='Efficient quick search' responseType="iresearcher-report" initialChatHistory='' reportId='' disable={false} />
    </ChatProvider>

}
