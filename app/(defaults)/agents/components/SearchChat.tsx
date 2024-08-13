

"use client"

import ChatWindow from "@/components/chat/ChatWindow"
import { ChatProvider } from "@/contexts/ChatContext"

export default function SearchChat() {
    return <ChatProvider>
        <ChatWindow title='Search' subTitle='Efficient search' responseType="search" initialChatHistory='' reportId='' disable={false} />
    </ChatProvider>

}
