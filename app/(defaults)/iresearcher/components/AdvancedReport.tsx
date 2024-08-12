"use client"
import { useResearcher } from "@/contexts/ResearcherContext";
import AdvancedReportContainer from "../../researcher-chat/components/AdvancedReportContainer";


export default function AdvancedReport() {
    const { chatHistory } = useResearcher();

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
