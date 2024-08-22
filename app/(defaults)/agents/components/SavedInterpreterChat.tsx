
"use client"

import ChatWindow from "@/components/chat/ChatWindow"
import { ChatProvider } from "@/contexts/ChatContext"
import { agents, suggestions } from "@/lib/constants";

interface SavedInterpreterChatProps {
    initialChatHistory: string;
    reportId: string;
}

export default function SavedInterpreterChat({ initialChatHistory, reportId }: SavedInterpreterChatProps) {
    const agent = agents["INTERPRETER"]
    return <ChatProvider>
        <ChatWindow title={agent.name} subTitle={agent.tagLine} suggestions={suggestions} responseType='code-interpreter' initialChatHistory={initialChatHistory} reportId={reportId} disable={false} />
    </ChatProvider>

}
