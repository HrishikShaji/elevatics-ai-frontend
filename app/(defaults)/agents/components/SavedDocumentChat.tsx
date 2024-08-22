
"use client"

import ChatWindow from "@/components/chat/ChatWindow"
import { ChatProvider } from "@/contexts/ChatContext"
import { agents, suggestions } from "@/lib/constants";

interface SavedDocumentChatProps {
    initialChatHistory: string;
    reportId: string;
}

export default function SavedDocumentChat({ initialChatHistory, reportId }: SavedDocumentChatProps) {

    const agent = agents["DOCUMENT"]
    return <ChatProvider>
        <ChatWindow title={agent.name} subTitle={agent.tagLine} suggestions={suggestions} responseType='document' initialChatHistory={initialChatHistory} reportId={reportId} disable={false} />
    </ChatProvider>

}
