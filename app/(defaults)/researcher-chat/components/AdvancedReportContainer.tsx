
import { Chat } from "@/types/types";
import TypedMarkdown from "../../search/components/TypedMarkdown";
import { useEffect, useRef, useState } from "react";
import SourcesModal from "@/components/SourcesModal";
import { RefObject } from "@fullcalendar/core/preact";
import ChatMarkdownRender from "@/components/chat/ChatMarkdownRender";

interface AdvancedReportContainerProps {
    chat: Chat
}

export default function AdvancedReportContainer({ chat }: AdvancedReportContainerProps) {
    const [currentParentKey, setCurrentParentKey] = useState("")
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chat.sliderKeys) {
            setCurrentParentKey(chat.sliderKeys[0])
        }
    }, [chat.sliderKeys])


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
    return (
        <>
            <div className="flex py-1 pb-3 justify-between w-full overflow-hiiden">
                <button
                    onClick={() => scrollLeft(containerRef)}
                    className=" size-6 flex items-center justify-center bg-black text-white hover:text-black  hover:bg-gray-300 rounded-full"
                >
                    {"<"}
                </button>
                <div className='w-[630px]  flex gap-2 overflow-hidden' ref={containerRef}>
                    {chat.sliderKeys?.map((item, k) => (<button className='p-1 text-nowrap px-3 rounded-md bg-black text-white' onClick={() => setCurrentParentKey(item)}>{item}</button>))}
                </div>
                <button
                    onClick={() => scrollRight(containerRef)}
                    className=" size-6 flex items-center justify-center bg-black text-white hover:text-black  hover:bg-gray-300 rounded-full"
                >
                    {">"}
                </button>
            </div>
            <div className='flex flex-col gap-10 max-h-[70vh] overflow-y-scroll custom-scrollbar'>
                {chat.reports?.map((report, j) => (
                    <div key={j} style={{ display: currentParentKey === report.parentKey ? "block" : "none" }} >
                        <ChatMarkdownRender text={report.report} disableTyping={false} />
                    </div>
                ))}
            </div>
            <div className="w-full flex justify-end pt-2">
                <SourcesModal metadata={chat.metadata as string} />
            </div>

        </>
    )

}
