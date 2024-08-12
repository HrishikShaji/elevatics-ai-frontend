import { Chat } from "@/types/types"

interface Props {
    chat: Chat
}

export default function CheckResponseType({ chat }: Props) {
    const parsedContent = JSON.parse(chat.content)
    console.log(parsedContent)
    return <div></div>
}
