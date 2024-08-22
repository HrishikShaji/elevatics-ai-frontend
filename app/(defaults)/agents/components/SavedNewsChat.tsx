


"use client"

import ChatWindow from "@/components/chat/ChatWindow"
import { ChatProvider } from "@/contexts/ChatContext"
import { agents, suggestions } from "@/lib/constants";

interface SavedNewsChatProps {
    initialChatHistory: string;
    reportId: string;
}

export default function SavedNewsChat({ initialChatHistory, reportId }: SavedNewsChatProps) {
    const agent = agents["NEWS"]
    return <ChatProvider>
        <ChatWindow title={agent.name} subTitle={agent.tagLine} suggestions={suggestions} responseType='news' initialChatHistory={initialChatHistory} reportId={reportId} disable={false} />
    </ChatProvider>

}
