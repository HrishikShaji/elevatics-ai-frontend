
"use client"

import ChatWindow from "@/components/chat/ChatWindow"
import { ChatProvider } from "@/contexts/ChatContext"

export default function InterpreterChat() {
    return <ChatProvider>
        <ChatWindow title='Interpreter' subTitle='Efficient interpreter' responseType="code-interpreter" initialChatHistory='' reportId='' disable={false} />
    </ChatProvider>

}
