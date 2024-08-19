"use client"

import ChatWindow from "@/components/chat/ChatWindow"
import { ChatProvider } from "@/contexts/ChatContext"
import { agents, suggestions } from "@/lib/constants"
import { AiFillBehanceCircle } from "react-icons/ai"

export default function ResearcherChat() {
    const agent = agents["RESEARCHERCHAT"]
    return <ChatProvider>
        <ChatWindow title={agent.name} subTitle={agent.tagLine} suggestions={suggestions} responseType='iresearcher-topics' initialChatHistory='' reportId='' disable={false} />
    </ChatProvider>

}
