

"use client"

import ChatWindow from "@/components/chat/ChatWindow"
import { ChatProvider } from "@/contexts/ChatContext"

interface SavedQuickChatProps {
    initialChatHistory: string;
    reportId: string;
}

export default function SavedQuickChat({ initialChatHistory, reportId }: SavedQuickChatProps) {
    return <ChatProvider>
        <ChatWindow title='Quick Search' subTitle='Efficient research' responseType='iresearcher-report' initialChatHistory={initialChatHistory} reportId={reportId} disable={false} />
    </ChatProvider>

}
