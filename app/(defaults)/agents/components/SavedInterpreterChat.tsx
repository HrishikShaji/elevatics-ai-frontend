
"use client"

import ChatWindow from "@/components/chat/ChatWindow"
import { ChatProvider } from "@/contexts/ChatContext"

interface SavedInterpreterChatProps {
    initialChatHistory: string;
    reportId: string;
}

export default function SavedInterpreterChat({ initialChatHistory, reportId }: SavedInterpreterChatProps) {
    return <ChatProvider>
        <ChatWindow title='Interpreter' subTitle='Efficient interpreter' responseType='code-interpreter' initialChatHistory={initialChatHistory} reportId={reportId} disable={false} />
    </ChatProvider>

}
