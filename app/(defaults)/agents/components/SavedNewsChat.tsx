


"use client"

import ChatWindow from "@/components/chat/ChatWindow"
import { ChatProvider } from "@/contexts/ChatContext"

interface SavedNewsChatProps {
    initialChatHistory: string;
    reportId: string;
}

export default function SavedNewsChat({ initialChatHistory, reportId }: SavedNewsChatProps) {
    return <ChatProvider>
        <ChatWindow title='News' subTitle='Efficient news' responseType='news' initialChatHistory={initialChatHistory} reportId={reportId} disable={false} />
    </ChatProvider>

}
