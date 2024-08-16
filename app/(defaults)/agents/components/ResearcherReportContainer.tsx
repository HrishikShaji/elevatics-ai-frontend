import { Chat } from "@/types/types";
import { useEffect, useRef, useState } from "react";
import SourcesModal from "@/components/SourcesModal";
import { RefObject } from "@fullcalendar/core/preact";
import ChatMarkdownRender from "@/components/chat/ChatMarkdownRender";
import ChatScrollWrapper from "@/components/chat/ChatScrollWrapper";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import SourcesSection from "@/components/SourcesSection";
interface ResearcherReportContainerProps {
    chat: Chat
}

export default function ResearcherReportContainer({ chat }: ResearcherReportContainerProps) {
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
        <div className="w-[1000px] bg-gray-200 rounded-3xl p-5 flex flex-col gap-5">
            <div className="flex py-1 pb-3 justify-between w-full overflow-hiiden">
                <button
                    onClick={() => scrollLeft(containerRef)}
                    className=" size-10 flex  items-center justify-center  hover:text-black  hover:bg-gray-300 rounded-full"
                >
                    <IoIosArrowBack size={25} />
                </button>
                <div className='w-[800px] justify-center  flex gap-4 overflow-hidden' ref={containerRef}>
                    {chat.sliderKeys?.map((item, k) => (<button className='p-1 text-nowrap px-3 rounded-md bg-white text-black' onClick={() => setCurrentParentKey(item)}>{item}</button>))}
                </div>
                <button
                    onClick={() => scrollRight(containerRef)}
                    className=" size-10 flex items-center justify-center  hover:text-black  hover:bg-gray-300 rounded-full"
                >
                    <IoIosArrowForward size={25} />
                </button>
            </div>
            <ChatScrollWrapper>
                <div className="flex flex-col gap-10">
                    {chat.reports?.map((report, j) => {
                        return <div key={j} className="flex flex-col gap-10 " style={{ display: currentParentKey === report.parentKey ? "block" : "none" }} >
                            <ChatMarkdownRender text={report.report} disableTyping={false} />
                            <SourcesSection metadata={report.metadata} />
                        </div>
                    })}
                </div>
            </ChatScrollWrapper>
            <div className="w-full flex justify-end pt-2">
                <SourcesModal metadata={chat.metadata as string} />
            </div>

        </div>
    )

}
