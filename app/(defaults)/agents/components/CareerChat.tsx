
"use client"

import ChatWindow from "@/components/chat/ChatWindow"
import { ChatProvider } from "@/contexts/ChatContext"

export default function CareerChat() {
    return <ChatProvider>
        <ChatWindow title='Career' subTitle='Efficient career' responseType="career" initialChatHistory='' reportId='' disable={false} />
    </ChatProvider>

}
