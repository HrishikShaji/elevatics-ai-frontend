import { Chat } from "@/types/types";
import ChatScrollWrapper from "./ChatScrollWrapper";
import ChatMessageUserWrapper from "./ChatMessageUserWrapper";
import ChatMessageAgentWrapper from "./ChatMessageAgentWrapper";
import ChatMarkdownRender from "./ChatMarkdownRender";
import AdvancedTopics from "@/app/(defaults)/researcher-chat/components/AdvancedTopics";
import AdvancedReportContainer from "@/app/(defaults)/researcher-chat/components/AdvancedReportContainer";
import ChatPlotly from "./ChatPlotly";
import CheckResponseType from "./CheckResponseType";

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
                        {chat.type === "iresearcher-report" ?
                            <ChatMarkdownRender disableTyping={false} text={chat.content} />
                            : null}
                        {chat.type === "iresearcher-topics" ?
                            <AdvancedTopics content={chat.content} />
                            : null}
                        {chat.type === "iresearcher-reports" ?
                            <AdvancedReportContainer chat={chat} />
                            : null}
                        {chat.type === "document" ?
                            <ChatMarkdownRender disableTyping={false} text={chat.content} />
                            : null}
                        {chat.type === "search" ?
                            <ChatMarkdownRender disableTyping={false} text={chat.content} />
                            : null}
                        {chat.type === "news" ?
                            <ChatMarkdownRender disableTyping={false} text={chat.content} />
                            : null}
                        {chat.type === "coder" ?
                            <ChatMarkdownRender disableTyping={false} text={chat.content} />
                            : null}
                        {chat.type === "text" ?
                            <ChatMarkdownRender disableTyping={false} text={chat.content} />
                            : null}
                        {chat.type === "plotly" ?
                            <ChatPlotly chat={chat} />
                            : null}
                        {chat.type === "code-interpreter" ?
                            <CheckResponseType chat={chat} />
                            : null}
                    </ChatMessageAgentWrapper>
                )))}
        </div>
    </ChatScrollWrapper>
    )
}
