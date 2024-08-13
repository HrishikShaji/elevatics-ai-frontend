

"use client"

import ChatWindow from "@/components/chat/ChatWindow"
import { ChatProvider } from "@/contexts/ChatContext"

interface SavedCareerChatProps {
    initialChatHistory: string;
    reportId: string;
}

export default function SavedCareerChat({ initialChatHistory, reportId }: SavedCareerChatProps) {
    return <ChatProvider>
        <ChatWindow title='Career' subTitle='Efficient career' responseType='career' initialChatHistory={initialChatHistory} reportId={reportId} disable={false} />
    </ChatProvider>

}
