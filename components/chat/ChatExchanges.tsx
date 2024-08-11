import { Chat } from "@/types/types";
import ChatScrollWrapper from "./ChatScrollWrapper";
import ChatMessageUserWrapper from "./ChatMessageUserWrapper";
import ChatMessageAgentWrapper from "./ChatMessageAgentWrapper";
import ChatMarkdownRender from "./ChatMarkdownRender";

interface ChatExchangesProps {
    chatHistory: Chat[];
    loading: boolean;
}

export default function ChatExchanges({ chatHistory, loading }: ChatExchangesProps) {

    if (chatHistory.length === 0) return null;
    return (<ChatScrollWrapper>
        <div className="w-[1000px] py-5 flex flex-col gap-2">
            {chatHistory.map((chat, i) => (
                chat.role === "user" ? (
                    <ChatMessageUserWrapper key={i}>
                        {chat.content}
                    </ChatMessageUserWrapper>
                ) : (
                    <ChatMessageAgentWrapper key={i}>
                        <ChatMarkdownRender disableTyping={false} text={chat.content} />
                    </ChatMessageAgentWrapper>
                )))}
        </div>
    </ChatScrollWrapper>
    )
}
