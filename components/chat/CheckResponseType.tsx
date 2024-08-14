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
    console.log("this is the array", parsedContent)
    return <div>{parsedContent.map((item, i) => {
        return item.type === "plotly" ? <ClientSideChatPlotly content={item.content} /> : item.type === "HTML" ? <div dangerouslySetInnerHTML={{ __html: item.content }}></div> : <ChatMarkdownRender text={item.content} disableTyping={false} key={i} />
    })}</div>
}
