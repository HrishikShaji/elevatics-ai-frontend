
"use client"
import { useEffect } from "react";
import { useChat } from "@/contexts/ChatContext";
import ChatWrapper from "./ChatWrapper";
import ChatExchanges from "./ChatExchanges";
import ChatSearchBar from "./ChatSearchBar";
import { ChatType } from "@/types/types";

interface ChatWindowProps {
    initialChatHistory: string;
    reportId: string;
    disable: boolean;
    title: string;
    subTitle: string;
    responseType: ChatType;
    suggestions: string[]
}

export default function ChatWindow({ suggestions, responseType, title, subTitle, disable, initialChatHistory, reportId }: ChatWindowProps) {

    const { setChatHistory, setReportId, setConversationId } = useChat()

    useEffect(() => {
        if (initialChatHistory === "") {
            setChatHistory([])
            setReportId("")
        } else {
            const parsedData = JSON.parse(initialChatHistory)
            setChatHistory(parsedData.chatHistory)
            setConversationId(parsedData.conversationId);
            setReportId(reportId)
        }
    }, [initialChatHistory, reportId]);

    return (
        <ChatWrapper>
            <ChatExchanges />
            <ChatSearchBar suggestions={suggestions} disable={disable} title={title} subTitle={subTitle} responseType={responseType} />
        </ChatWrapper>
    );
}
