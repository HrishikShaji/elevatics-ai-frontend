

"use client"

import ChatWindow from "@/components/chat/ChatWindow"
import { ChatProvider } from "@/contexts/ChatContext"

interface SavedCoderChatProps {
    initialChatHistory: string;
    reportId: string;
}

export default function SavedCoderChat({ initialChatHistory, reportId }: SavedCoderChatProps) {
    return <ChatProvider>
        <ChatWindow title='Coder' subTitle='Efficient coding' responseType='coder' initialChatHistory={initialChatHistory} reportId={reportId} disable={false} />
    </ChatProvider>

}
