"use client"

import ChatWindow from "@/components/chat/ChatWindow"
import { ChatProvider } from "@/contexts/ChatContext"
import { agents, suggestions } from "@/lib/constants"

export default function DocumentChat() {
    const agent = agents["DOCUMENT"]
    return <ChatProvider>
        <ChatWindow title={agent.name} subTitle={agent.tagLine} suggestions={suggestions} responseType="document" initialChatHistory='' reportId='' disable={false} />
    </ChatProvider>

}
