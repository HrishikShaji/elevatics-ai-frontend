"use client"

import ChatWindow from "@/components/chat/ChatWindow"
import { ChatProvider } from "@/contexts/ChatContext"

export default function FollowUpChat() {
    return <ChatProvider>
        <ChatWindow title='Follow up' subTitle='Efficient follow' responseType="followup" initialChatHistory='' reportId='' disable={false} />
    </ChatProvider>

}
