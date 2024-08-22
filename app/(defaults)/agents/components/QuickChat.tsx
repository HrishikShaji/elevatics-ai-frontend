


"use client"

import ChatWindow from "@/components/chat/ChatWindow"
import { ChatProvider } from "@/contexts/ChatContext"
import { agents, suggestions } from "@/lib/constants"

export default function QuickChat() {
    const agent = agents["QUICK"]
    return <ChatProvider>
        <ChatWindow title={agent.name} subTitle={agent.tagLine} responseType="iresearcher-report" suggestions={suggestions} initialChatHistory='' reportId='' disable={false} />
    </ChatProvider>

}
