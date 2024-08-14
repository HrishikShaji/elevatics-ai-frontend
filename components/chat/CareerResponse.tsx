import { Chat } from "@/types/types";
import ChatMarkdownRender from "./ChatMarkdownRender";


interface CareerResponseProps {
    chat: Chat
}

export default function CareerResponse({ chat }: CareerResponseProps) {
    return <ChatMarkdownRender disableTyping={false} text={chat.content} />
}
