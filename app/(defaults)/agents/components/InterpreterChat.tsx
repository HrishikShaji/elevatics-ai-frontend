
"use client"

import ChatWindow from "@/components/chat/ChatWindow"
import { ChatProvider } from "@/contexts/ChatContext"
import { agents, suggestions } from "@/lib/constants"

export default function InterpreterChat() {
    const agent = agents["INTERPRETER"]
    return <ChatProvider>
        <ChatWindow title={agent.name} subTitle={agent.tagLine} suggestions={suggestions} responseType="code-interpreter" initialChatHistory='' reportId='' disable={false} />
    </ChatProvider>

}
