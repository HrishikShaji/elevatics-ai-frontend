
"use client"

import ChatWindow from "@/components/chat/ChatWindow"
import { ChatProvider } from "@/contexts/ChatContext"

export default function CoderChat() {
    return <ChatProvider>
        <ChatWindow title='Coder' subTitle='Efficient coding' responseType="coder" initialChatHistory='' reportId='' disable={false} />
    </ChatProvider>

}
