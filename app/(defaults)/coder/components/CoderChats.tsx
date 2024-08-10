
import AutoScrollWrapper from "../../search/components/AutoScrollWrapper";
import { Chat } from "@/types/types";
import AgentMessageWrapper from "../../sample/components/BotMessageWrapper";
import UserMessageWrapper from "../../sample/components/UserMessageWrapper";
import TypedMarkdown from "../../search/components/TypedMarkdown";

interface CoderChatsProps {
    chatHistory: Chat[];
    loading: boolean;
}

export default function CoderChats({ chatHistory, loading }: CoderChatsProps) {

    if (chatHistory.length === 0) return null;

    return (<AutoScrollWrapper>
        <div className="w-[1000px] py-5 flex flex-col gap-2">
            {chatHistory.map((chat, i) => (
                chat.role === "user" ? (
                    <UserMessageWrapper key={i}>
                        {chat.content}
                    </UserMessageWrapper>
                ) : (
                    <AgentMessageWrapper key={i}>
                        <TypedMarkdown disableTyping={false} text={chat.content} />
                    </AgentMessageWrapper>

                )))}
        </div>
    </AutoScrollWrapper>
    )
}
