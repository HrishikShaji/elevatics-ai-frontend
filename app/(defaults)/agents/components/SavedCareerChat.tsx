

"use client"

import ChatWindow from "@/components/chat/ChatWindow"
import { ChatProvider } from "@/contexts/ChatContext"
import { agents, suggestions } from "@/lib/constants";

interface SavedCareerChatProps {
    initialChatHistory: string;
    reportId: string;
}

export default function SavedCareerChat({ initialChatHistory, reportId }: SavedCareerChatProps) {
    const agent = agents["CAREER"]
    return <ChatProvider>
        <ChatWindow title={agent.name} subTitle={agent.tagLine} responseType='career' suggestions={suggestions} initialChatHistory={initialChatHistory} reportId={reportId} disable={false} />
    </ChatProvider>

}
