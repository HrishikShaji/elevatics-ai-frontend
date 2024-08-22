
"use client"

import ChatWindow from "@/components/chat/ChatWindow"
import { ChatProvider } from "@/contexts/ChatContext"
import { agents, suggestions } from "@/lib/constants";

interface SavedResearcherChatProps {
    initialChatHistory: string;
    reportId: string;
}

export default function SavedResearcherChat({ initialChatHistory, reportId }: SavedResearcherChatProps) {
    const agent = agents["RESEARCHERCHAT"]
    return <ChatProvider>
        <ChatWindow title={agent.name} subTitle={agent.tagLine} suggestions={suggestions} responseType='iresearcher-topics' initialChatHistory={initialChatHistory} reportId={reportId} disable={false} />
    </ChatProvider>

}
