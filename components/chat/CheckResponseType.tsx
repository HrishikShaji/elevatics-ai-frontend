import { Chat } from "@/types/types"
import ChatMarkdownRender from "./ChatMarkdownRender";

import dynamic from "next/dynamic"

const ClientSideChatPlotly = dynamic(
    () => import('./ChatPlotly'),
    { ssr: false }
);


type InterpreterResponseType = {
    content: string;
    type: "text" | "plotly" | "HTML"
}
interface Props {
    chat: Chat
}

export default function CheckResponseType({ chat }: Props) {
    const parsedContent = JSON.parse(chat.content) as InterpreterResponseType[]
    return <div>{parsedContent.map((item, i) => {
        console.log("type is:", item.type, "content is:", item.content)
        return item.type === "plotly" ? <ClientSideChatPlotly chat={chat} /> : item.type === "HTML" ? <div dangerouslySetInnerHTML={{ __html: item.content }}></div> : <ChatMarkdownRender text={item.content} disableTyping={false} key={i} />
    })}</div>
}
