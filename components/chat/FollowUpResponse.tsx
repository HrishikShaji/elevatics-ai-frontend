import { Chat } from "@/types/types"
import ChatMarkdownRender from "./ChatMarkdownRender"

interface FollowUpResponseProps {
    chat: Chat
}

export default function FollowUpResponse({ chat }: FollowUpResponseProps) {
    console.log(chat)
    return <ChatMarkdownRender disableTyping={false} text={chat.content} />
}
