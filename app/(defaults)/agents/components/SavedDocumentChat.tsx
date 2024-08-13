
"use client"

import ChatWindow from "@/components/chat/ChatWindow"
import { ChatProvider } from "@/contexts/ChatContext"

interface SavedDocumentChatProps {
    initialChatHistory: string;
    reportId: string;
}

export default function SavedDocumentChat({ initialChatHistory, reportId }: SavedDocumentChatProps) {
    return <ChatProvider>
        <ChatWindow title='Document' subTitle='Efficient document' responseType='document' initialChatHistory={initialChatHistory} reportId={reportId} disable={false} />
    </ChatProvider>

}
