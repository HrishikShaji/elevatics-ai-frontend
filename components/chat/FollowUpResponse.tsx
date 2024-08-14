import { Chat } from "@/types/types"
import ChatMarkdownRender from "./ChatMarkdownRender"

interface FollowUpResponseProps {
    chat: Chat
}

export default function FollowUpResponse({ chat }: FollowUpResponseProps) {
    console.log("this is content:", chat.content)
    console.log("this is metadata:", chat.metadata)
    return <ChatMarkdownRender
        disableTyping={false} text={chat.content} />
}
