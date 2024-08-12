
"use client"
import { useResearcher } from "@/contexts/ResearcherContext";
import { useEffect, useState } from "react";
import { Chat } from "@/types/types";
import AdvancedReportContainer from "@/app/(defaults)/researcher-chat/components/AdvancedReportContainer";


interface SavedAdvancedProps {
    name: string;
    data: string;
}

export default function SavedAdvancedReport({ data, name }: SavedAdvancedProps) {
    const [chatHistory, setChatHistory] = useState<Chat[]>([])

    useEffect(() => {
        const parsedData = JSON.parse(data)
        const chats = parsedData.chatHistory as Chat[];
        setChatHistory(chats)
    }, [data, name])


    return (
        <>
            {chatHistory.length > 0 ? (
                <>
                    <div className="flex flex-col gap-10 max-h-[70vh] overflow-y-scroll custom-scrollbar">
                        {chatHistory.map((chat, j) => (
                            <div key={j}>
                                <AdvancedReportContainer chat={chat} />
                            </div>
                        ))}
                    </div>
                    <div className="w-full flex justify-end pt-2"></div>
                </>
            ) : (
                "loading"
            )}
        </>
    );
}
