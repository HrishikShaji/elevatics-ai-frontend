

"use client"

import ChatWindow from "@/components/chat/ChatWindow"
import { ChatProvider } from "@/contexts/ChatContext"
import { agents, suggestions } from "@/lib/constants"

export default function SearchChat() {
    const agent = agents["SEARCH"]
    return <ChatProvider>
        <ChatWindow title={agent.name} subTitle={agent.tagLine} suggestions={suggestions} responseType="search" initialChatHistory='' reportId='' disable={false} />
    </ChatProvider>

}
