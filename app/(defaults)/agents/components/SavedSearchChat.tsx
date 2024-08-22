"use client"

import ChatWindow from "@/components/chat/ChatWindow"
import { ChatProvider } from "@/contexts/ChatContext"
import { agents, suggestions } from "@/lib/constants";

interface SavedSearchChatProps {
    initialChatHistory: string;
    reportId: string;
}

export default function SavedSearchChat({ initialChatHistory, reportId }: SavedSearchChatProps) {
    const agent = agents["SEARCH"]
    return <ChatProvider>
        <ChatWindow title={agent.name} subTitle={agent.tagLine} suggestions={suggestions} responseType='search' initialChatHistory={initialChatHistory} reportId={reportId} disable={false} />
    </ChatProvider>

}
