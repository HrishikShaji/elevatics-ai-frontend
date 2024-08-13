"use client"
import { useEffect, useState } from "react";
import { Chat } from "@/types/types";
import ResearcherReportContainer from "./ResearcherReportContainer";


interface SavedResearcherReportHomeProps {
    name: string;
    data: string;
}

export default function SavedResearcherReportHome({ data, name }: SavedResearcherReportHomeProps) {
    const [chatHistory, setChatHistory] = useState<Chat[]>([])

    useEffect(() => {
        const parsedData = JSON.parse(data)
        const chats = parsedData.chatHistory as Chat[];
        setChatHistory(chats)
    }, [data, name])


    return (
        <div className="w-full h-screen p-10 justify-center">
            {chatHistory.length > 0 ? chatHistory.map((chat, j) => (
                <ResearcherReportContainer key={j} chat={chat} />
            ))
                : (
                    "loading"
                )}
        </div>
    );
}
