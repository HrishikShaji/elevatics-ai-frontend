

"use client"

import ChatWindow from "@/components/chat/ChatWindow"
import { ChatProvider } from "@/contexts/ChatContext"

export default function NewsChat() {
    return <ChatProvider>
        <ChatWindow title='News' subTitle='Efficient news' responseType="news" initialChatHistory='' reportId='' disable={false} />
    </ChatProvider>

}
