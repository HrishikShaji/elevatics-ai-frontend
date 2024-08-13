"use client"

import ChatWindow from "@/components/chat/ChatWindow"
import { ChatProvider } from "@/contexts/ChatContext"

export default function DocumentChat() {
    return <ChatProvider>
        <ChatWindow title='Document' subTitle='Efficient document' responseType="document" initialChatHistory='' reportId='' disable={false} />
    </ChatProvider>

}
