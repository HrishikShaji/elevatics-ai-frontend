"use client"

import ChatWindow from "@/components/chat/ChatWindow"
import { ChatProvider } from "@/contexts/ChatContext"

interface SavedSearchChatProps {
    initialChatHistory: string;
    reportId: string;
}

export default function SavedSearchChat({ initialChatHistory, reportId }: SavedSearchChatProps) {
    return <ChatProvider>
        <ChatWindow title='Search' subTitle='Efficient search' responseType='search' initialChatHistory={initialChatHistory} reportId={reportId} disable={false} />
    </ChatProvider>

}
