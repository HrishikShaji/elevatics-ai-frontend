import { Chat } from "@/types/types";
import { SiInternetcomputer } from "react-icons/si";
import TypedMarkdown from "../../search/components/TypedMarkdown";
import { useEffect, useState } from "react";
import SourcesModal from "@/components/SourcesModal";

interface AdvancedReportContainerProps {
    chat: Chat
}

export default function AdvancedReportContainer({ chat }: AdvancedReportContainerProps) {
    const [currentParentKey, setCurrentParentKey] = useState("")

    useEffect(() => {
        if (chat.sliderKeys) {
            setCurrentParentKey(chat.sliderKeys[0])
        }
    }, [chat.sliderKeys])

    return (
        <div className='w-full justify-start'>
            <div className='  flex gap-2 p-1'>
                <div className='h-8 w-8 flex-shrink-0 rounded-full bg-gray-400 flex items-center justify-center text-black'>
                    <SiInternetcomputer color="white" />
                </div>
                <div className='flex p-4 rounded-3xl bg-gray-200 flex-col'>
                    <div className='w-full bg-blue-500 flex gap-2'>
                        {chat.sliderKeys?.map((item, k) => (<button className='p-1 rounded-md bg-black text-white' onClick={() => setCurrentParentKey(item)}>{item}</button>))}
                    </div>
                    <div className='flex flex-col gap-10 max-h-[60vh] overflow-y-scroll custom-scrollbar'>
                        {chat.reports?.map((report, j) => (
                            <div key={j} style={{ display: currentParentKey === report.parentKey ? "block" : "none" }} className='bg-gray-100'>
                                <TypedMarkdown text={report.report} disableTyping={false} />
                            </div>
                        ))}
                    </div>
                    <div className="w-full flex justify-end">
                        <SourcesModal metadata={chat.metadata as string} />
                    </div>
                </div>
            </div>
        </div>

    )

}
