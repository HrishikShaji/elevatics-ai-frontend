import { Chat } from "@/types/types";
import { SiInternetcomputer } from "react-icons/si";
import TypedMarkdown from "../../search/components/TypedMarkdown";
import { useEffect, useRef, useState } from "react";
import SourcesModal from "@/components/SourcesModal";
import { RefObject } from "@fullcalendar/core/preact";

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
        <div className='w-full justify-start'>
            <div className='  flex gap-2 p-1'>
                <div className='h-8 w-8 flex-shrink-0 rounded-full bg-gray-400 flex items-center justify-center text-black'>
                    <SiInternetcomputer color="white" />
                </div>
                <div className='flex p-4 rounded-3xl  flex-col justify-between bg-gray-200'>
                    <div className="flex py-1 pb-3 justify-between w-full">
                        <button
                            onClick={() => scrollLeft(containerRef)}
                            className=" size-6 flex items-center justify-center bg-black text-white hover:text-black  hover:bg-gray-300 rounded-full"
                        >
                            {"<"}
                        </button>
                        <div className='w-[630px]  flex gap-2' ref={containerRef}>
                            {chat.sliderKeys?.map((item, k) => (<button className='p-1 rounded-md bg-black text-white' onClick={() => setCurrentParentKey(item)}>{item}</button>))}
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
                                <TypedMarkdown text={report.report} disableTyping={false} />
                            </div>
                        ))}
                    </div>
                    <div className="w-full flex justify-end pt-2">
                        <SourcesModal metadata={chat.metadata as string} />
                    </div>
                </div>
            </div>
        </div>

    )

}
