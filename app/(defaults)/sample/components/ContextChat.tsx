import { useMemo } from "react";
import UserMessageWrapper from "./UserMessageWrapper";
import AgentMessageWrapper from "./BotMessageWrapper";
import AdvancedReportContainer from "./AdvancedReportContainer";
import { useAdvanced } from "./AdvancedContext";
import AutoScrollWrapper from "../../search/components/AutoScrollWrapper";
import ContextTopics from "./ContextTopics";
import SliderWrapper from "./SliderWrapper";
import SourcesModal from "@/components/SourcesModal";
import AdvancedReportWrapper from "./AdvancedReportWrapper";


export default function ContextChat() {
    const { chatHistory, topicsLoading } = useAdvanced()

    if (chatHistory.length === 0) return null;

    return (<AutoScrollWrapper>
        <div className="w-[1000px] py-5 flex flex-col gap-2">
            {chatHistory.map((chat, i) => (
                chat.role === "user" ? (
                    <UserMessageWrapper key={i}>
                        {chat.content}
                    </UserMessageWrapper>
                ) : chat.role === "options" ? (
                    <AgentMessageWrapper key={i}>
                        <ContextTopics content={chat.content} />
                    </AgentMessageWrapper>
                ) : (
                    <AgentMessageWrapper key={i}>
                        <AdvancedReportWrapper chat={chat} key={i} />
                        <div className="w-full flex justify-end pt-2">
                            <SourcesModal metadata={chat.metadata as string} />
                        </div>
                    </AgentMessageWrapper>
                )
            ))}
            {topicsLoading && (
                <AgentMessageWrapper>
                    Loading...
                </AgentMessageWrapper>
            )}
        </div>
    </AutoScrollWrapper>
    )
}
