

import AutoScrollWrapper from "../../search/components/AutoScrollWrapper";
import { Chat } from "@/types/types";
import AgentMessageWrapper from "../../sample/components/BotMessageWrapper";
import UserMessageWrapper from "../../sample/components/UserMessageWrapper";
import TypedMarkdown from "../../search/components/TypedMarkdown";

interface DocumentChatsProps {
    chatHistory: Chat[];
    loading: boolean;
}

export default function DocumentChats({ chatHistory, loading }: DocumentChatsProps) {

    if (chatHistory.length === 0) return null;
    console.log(chatHistory)
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
