"use client"
import { useResearcher } from "@/contexts/ResearcherContext";
import ResearcherReportContainer from "./ResearcherReportContainer";

export default function ResearcherReportHome() {
    const { chatHistory } = useResearcher();

    return (
        <div className="w-full flex h-screen p-10 justify-center">
            {chatHistory.length > 0 ? chatHistory.map((chat, j) => (
                <ResearcherReportContainer key={j} chat={chat} />
            ))
                : (
                    "loading"
                )}
        </div>
    );
}
