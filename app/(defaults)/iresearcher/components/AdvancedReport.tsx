"use client"
import SourcesModal from "@/components/SourcesModal";
import ChatMarkdownRender from "@/components/chat/ChatMarkdownRender";
import { useResearcher } from "@/contexts/ResearcherContext";
import fetchResearcherReports from "@/lib/fetchResearcherReports";
import { Chat, ReportProps } from "@/types/types";
import { RefObject } from "@fullcalendar/core/preact";
import { useCallback, useEffect, useRef, useState } from "react";

export default function AdvancedReport() {
    const [chatHistory, setChatHistory] = useState<Chat[]>([]);
    const { selectedSubtasks } = useResearcher()

    useEffect(() => {
        const input = JSON.stringify(selectedSubtasks)
        fetchResearcherReports({ addReports: addReports, query: input })
    }, [selectedSubtasks])
    const addReports = useCallback(({ type, role, content, metadata, name, parentKey, report, sliderKeys }: ReportProps) => {
        setChatHistory((prevChatHistory) => {
            if (role === 'assistant' && prevChatHistory.length > 0 && prevChatHistory[prevChatHistory.length - 1].role === 'assistant') {
                const updatedChatHistory = [...prevChatHistory];
                const lastMessage = updatedChatHistory[updatedChatHistory.length - 1];

                if (lastMessage.content !== content || lastMessage.metadata !== metadata || lastMessage.sliderKeys !== sliderKeys) {
                    lastMessage.content = content;
                    lastMessage.metadata = metadata;
                    lastMessage.sliderKeys = sliderKeys;
                    lastMessage.type = type;

                    const currentReports = lastMessage.reports;
                    if (currentReports) {
                        const reportExist = currentReports.find((r) => r.name === name);
                        if (reportExist) {
                            reportExist.report = report;
                            reportExist.metadata = metadata;

                        } else {
                            currentReports.push({ name: name, parentKey: parentKey, report: report, metadata: metadata });
                        }
                    }
                }

                return updatedChatHistory;
            } else {
                return [...prevChatHistory, { type, role, content, metadata, reports: [] }];
            }
        });
    }, []);

    const [currentParentKey, setCurrentParentKey] = useState("")
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatHistory[0]?.sliderKeys) {
            setCurrentParentKey(chatHistory[0].sliderKeys[0])
        }
    }, [chatHistory[0]?.sliderKeys])


    function scrollLeft(ref: RefObject<HTMLDivElement>) {
        if (ref.current) {
            ref.current.scrollBy({
                left: -300,
                behavior: "smooth",
            });
        }
    }

    function scrollRight(ref: RefObject<HTMLDivElement>) {
        if (ref.current) {
            ref.current.scrollBy({
                left: 300,
                behavior: "smooth",
            });
        }
    }

    console.log(chatHistory[0])
    return (
        <>
            {chatHistory.length > 0 ?
                <>
                    <div className="flex py-1 pb-3 justify-between w-full overflow-hiiden">
                        <button
                            onClick={() => scrollLeft(containerRef)}
                            className=" size-6 flex items-center justify-center bg-black text-white hover:text-black  hover:bg-gray-300 rounded-full"
                        >
                            {"<"}
                        </button>
                        <div className='w-[630px]  flex gap-2 overflow-hidden' ref={containerRef}>
                            {chatHistory[0].sliderKeys?.map((item, k) => (<button className='p-1 text-nowrap px-3 rounded-md bg-black text-white' onClick={() => setCurrentParentKey(item)}>{item}</button>))}
                        </div>
                        <button
                            onClick={() => scrollRight(containerRef)}
                            className=" size-6 flex items-center justify-center bg-black text-white hover:text-black  hover:bg-gray-300 rounded-full"
                        >
                            {">"}
                        </button>
                    </div>
                    <div className='flex flex-col gap-10 max-h-[70vh] overflow-y-scroll custom-scrollbar'>
                        {chatHistory[0].reports?.map((report, j) => (
                            <div key={j} style={{ display: currentParentKey === report.parentKey ? "block" : "none" }} >
                                <ChatMarkdownRender text={report.report} disableTyping={false} />
                            </div>
                        ))}
                    </div>
                    <div className="w-full flex justify-end pt-2">
                        <SourcesModal metadata={chatHistory[0].metadata as string} />
                    </div>
                </>
                : "loading"}

        </>
    )
}
