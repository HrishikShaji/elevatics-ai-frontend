"use client"
import AgentContainer from "@/components/agent/AgentContainer";
import { useEffect } from "react";
import DocumentSearchBar from "./DocumentSearchBar";
import DocumentChats from "./DocumentChats";
import { useDocument } from "../contexts/DocumentContext";

interface AgentDocumentProps {
    initialChatHistory: string;
    reportId: string;
    disable: boolean;
}

export default function AgentDocument({ disable, initialChatHistory, reportId }: AgentDocumentProps) {

    const { loading, chatHistory, setChatHistory, setReportId, setConversationId } = useDocument()

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
        <AgentContainer>
            <DocumentChats chatHistory={chatHistory} loading={loading} />
            <DocumentSearchBar disable={disable} title="Document" subTitle='Efficient documents' />
        </AgentContainer >
    );
}
