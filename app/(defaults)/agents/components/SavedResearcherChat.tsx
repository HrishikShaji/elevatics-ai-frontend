
"use client"

import ChatWindow from "@/components/chat/ChatWindow"
import { ChatProvider } from "@/contexts/ChatContext"

interface SavedResearcherChatProps {
    initialChatHistory: string;
    reportId: string;
}

export default function SavedResearcherChat({ initialChatHistory, reportId }: SavedResearcherChatProps) {
    return <ChatProvider>
        <ChatWindow title='Researcher Chat' subTitle='Efficient research' responseType='iresearcher-topics' initialChatHistory={initialChatHistory} reportId={reportId} disable={false} />
    </ChatProvider>

}
