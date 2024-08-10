
import { Chat } from "@/types/types";
import TypedMarkdown from "../../search/components/TypedMarkdown";
import { ReactNode, useEffect, useState } from "react";
import SliderWrapper from "./SliderWrapper";

interface AdvancedReportWrapperProps {
    chat: Chat
}

export default function AdvancedReportWrapper({ chat }: AdvancedReportWrapperProps) {
    const [currentParentKey, setCurrentParentKey] = useState("")

    useEffect(() => {
        if (chat.sliderKeys) {
            setCurrentParentKey(chat.sliderKeys[0])
        }
    }, [chat.sliderKeys])


    return (
        <>
            <SliderWrapper>
                {chat.sliderKeys?.map((item, k) => (<button className='p-1 text-nowrap px-3 rounded-md bg-black text-white' onClick={() => setCurrentParentKey(item)}>{item}</button>))}
            </SliderWrapper>
            <div className='flex flex-col gap-10 max-h-[70vh] overflow-y-scroll custom-scrollbar'>
                {chat.reports?.map((report, j) => (
                    <div key={j} style={{ display: currentParentKey === report.parentKey ? "block" : "none" }} >
                        <TypedMarkdown text={report.report} disableTyping={false} />
                    </div>
                ))}
            </div>
        </>
    )

}
