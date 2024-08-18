import { Chat } from "@/types/types"
import ChatMarkdownRender from "./ChatMarkdownRender"

interface DocumentResponseProps {
    chat: Chat
}

export default function DocumentResponse({ chat }: DocumentResponseProps) {
    console.log(chat.metadata)
    return <div className="flex flex-col gap-2">
        <ChatMarkdownRender text={chat.content} disableTyping={false} />
    </div>
}
