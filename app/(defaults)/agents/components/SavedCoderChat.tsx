

"use client"

import ChatWindow from "@/components/chat/ChatWindow"
import { ChatProvider } from "@/contexts/ChatContext"
import { agents, suggestions } from "@/lib/constants";

interface SavedCoderChatProps {
    initialChatHistory: string;
    reportId: string;
}

export default function SavedCoderChat({ initialChatHistory, reportId }: SavedCoderChatProps) {
    const agent = agents["CODE"]
    return <ChatProvider>
        <ChatWindow title={agent.name} subTitle={agent.tagLine} suggestions={suggestions} responseType='coder' initialChatHistory={initialChatHistory} reportId={reportId} disable={false} />
    </ChatProvider>

}
