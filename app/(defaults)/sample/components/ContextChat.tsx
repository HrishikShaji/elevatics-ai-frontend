import { useMemo } from "react";
import UserMessageWrapper from "./UserMessageWrapper";
import AgentMessageWrapper from "./BotMessageWrapper";
import AdvancedReportContainer from "./AdvancedReportContainer";
import { useAdvanced } from "./AdvancedContext";
import AutoScrollWrapper from "../../search/components/AutoScrollWrapper";
import ContextTopics from "./ContextTopics";


export default function ContextChat() {
    const { chatHistory, topicsLoading } = useAdvanced()
    const MemoizedUserMessageWrapper = useMemo(() => UserMessageWrapper, []);
    const MemoizedAgentMessageWrapper = useMemo(() => AgentMessageWrapper, []);
    const MemoizedAdvancedReportContainer = useMemo(() => AdvancedReportContainer, []);

    if (chatHistory.length === 0) return null;

    return (<AutoScrollWrapper>
        <div className="w-[1000px] py-5 flex flex-col gap-2">
            {chatHistory.map((chat, i) => (
                chat.role === "user" ? (
                    <MemoizedUserMessageWrapper key={i}>
                        {chat.content}
                    </MemoizedUserMessageWrapper>
                ) : chat.role === "options" ? (
                    <MemoizedAgentMessageWrapper key={i}>
                        <ContextTopics content={chat.content} />
                    </MemoizedAgentMessageWrapper>
                ) : (
                    <MemoizedAgentMessageWrapper key={i}>
                        <MemoizedAdvancedReportContainer chat={chat} key={i} />
                    </MemoizedAgentMessageWrapper>
                )
            ))}
            {topicsLoading && (
                <MemoizedAgentMessageWrapper>
                    Loading...
                </MemoizedAgentMessageWrapper>
            )}
        </div>
    </AutoScrollWrapper>
    )
}
