

"use client"

import ChatWindow from "@/components/chat/ChatWindow"
import { ChatProvider } from "@/contexts/ChatContext"
import { agents, suggestions } from "@/lib/constants";

interface SavedQuickChatProps {
    initialChatHistory: string;
    reportId: string;
}

export default function SavedQuickChat({ initialChatHistory, reportId }: SavedQuickChatProps) {
    const agent = agents["QUICK"]
    return <ChatProvider>
        <ChatWindow title={agent.name} subTitle={agent.tagLine} suggestions={suggestions} responseType='iresearcher-report' initialChatHistory={initialChatHistory} reportId={reportId} disable={false} />
    </ChatProvider>

}
