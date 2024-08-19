

"use client"

import ChatWindow from "@/components/chat/ChatWindow"
import { ChatProvider } from "@/contexts/ChatContext"
import { agents, suggestions } from "@/lib/constants"

export default function NewsChat() {
    const agent = agents["NEWS"]
    return <ChatProvider>
        <ChatWindow title={agent.name} subTitle={agent.tagLine} suggestions={suggestions} responseType="news" initialChatHistory='' reportId='' disable={false} />
    </ChatProvider>

}
