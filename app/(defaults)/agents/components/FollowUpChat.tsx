"use client"

import ChatWindow from "@/components/chat/ChatWindow"
import { ChatProvider } from "@/contexts/ChatContext"
import { agents, suggestions } from "@/lib/constants"

export default function FollowUpChat() {
    const agent = agents["FOLLOWUP"]
    return <ChatProvider>
        <ChatWindow title={agent.name} subTitle={agent.tagLine} suggestions={suggestions} responseType="followup" initialChatHistory='' reportId='' disable={false} />
    </ChatProvider>

}
