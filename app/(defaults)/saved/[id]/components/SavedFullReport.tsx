import SliderTabs from "@/app/(defaults)/iresearcher/topics/report/components/SliderTabs";
import { useState } from "react";
import SavedMainTopic from "./SavedMainTopic";

interface SavedFullReportProps {
    name: string;
    report: string;
}

export default function SavedFullReport({ name, report }: SavedFullReportProps) {
    console.log(name, JSON.parse(report))
    const parsedData = JSON.parse(report)
    const [selectedTopic, setSelectedTopic] = useState(parsedData.groupedData[0]?.parentKey || '');
    return <div className="h-full pt-[10px] w-full flex flex-col flex-grow gap-5 items-center justify-between">
        <SliderTabs setSelectedTopic={setSelectedTopic} options={parsedData.groupedData} />
        <div className=" w-full">
            {parsedData.groupedData.map((group: any, i: number) => (
                <SavedMainTopic key={i} indexes={group.indexes} selectedTopic={selectedTopic} parentKey={group.parentKey} data={parsedData.data} />
            ))}
        </div>
    </div>
}
