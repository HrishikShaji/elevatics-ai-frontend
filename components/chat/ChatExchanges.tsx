import { Chat } from "@/types/types";
import ChatScrollWrapper from "./ChatScrollWrapper";
import ChatMessageUserWrapper from "./ChatMessageUserWrapper";
import ChatMessageAgentWrapper from "./ChatMessageAgentWrapper";
import ChatMarkdownRender from "./ChatMarkdownRender";
import CheckResponseType from "./CheckResponseType";
import CareerFollowUp from "./CareerFollowUp";
import CareerResponse from "./CareerResponse";
import FollowUpResponse from "./FollowUpResponse";
import ResearcherReportContainer from "@/app/(defaults)/agents/components/ResearcherReportContainer";
import ResearcherChatTopics from "./ResearcherChatTopics";
import SourcesSection from "../SourcesSection";

interface ChatExchangesProps {
    chatHistory: Chat[];
}

export default function ChatExchanges({ chatHistory }: ChatExchangesProps) {

    if (chatHistory.length === 0) return null;
    return (<ChatScrollWrapper>
        <div className="w-[1000px] py-5 flex flex-col gap-2">
            {chatHistory.map((chat, i) => (
                chat.role === "user" ? (
                    <ChatMessageUserWrapper key={i}>
                        {chat.content}
                    </ChatMessageUserWrapper>
                ) : (
                    <ChatMessageAgentWrapper isLoading={chat.content.length === 0} key={i}>
                        {chat.type === "iresearcher-report" ?
                            <div>
                                <ChatMarkdownRender disableTyping={false} text={chat.content} />
                                <SourcesSection metadata={chat.metadata as string} />
                            </div>
                            : null}
                        {chat.type === "iresearcher-topics" ?
                            <ResearcherChatTopics content={chat.content} />
                            : null}
                        {chat.type === "iresearcher-reports" ?
                            <ResearcherReportContainer chat={chat} />
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
                        {chat.type === "code-interpreter" ?
                            <CheckResponseType chat={chat} />
                            : null}
                        {chat.type === "career-question" ?
                            <CareerFollowUp chat={chat} />
                            : null}
                        {chat.type === "career" ?
                            <CareerResponse chat={chat} />
                            : null}
                        {chat.type === "followup" ? <FollowUpResponse chat={chat} /> : null}
                    </ChatMessageAgentWrapper>
                )))}
        </div>
    </ChatScrollWrapper>
    )
}
