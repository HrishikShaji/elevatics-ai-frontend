
"use client"

import ChatWindow from "@/components/chat/ChatWindow"
import { ChatProvider } from "@/contexts/ChatContext"
import { agents, suggestions } from "@/lib/constants"

export default function CoderChat() {
    const agent = agents["CODE"]
    return <ChatProvider>
        <ChatWindow title={agent.name} subTitle={agent.tagLine} suggestions={suggestions} responseType="coder" initialChatHistory='' reportId='' disable={false} />
    </ChatProvider>

}
