"use client"

import ChatWindow from "@/components/chat/ChatWindow"
import { ChatProvider } from "@/contexts/ChatContext"

export default function ResearcherChat() {
    return <ChatProvider>
        <ChatWindow title='Researcher Chat' subTitle='Efficient research' responseType='iresearcher-topics' initialChatHistory='' reportId='' disable={false} />
    </ChatProvider>

}
