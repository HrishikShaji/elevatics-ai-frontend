
import IconMinusCircle from "@/components/icon/icon-minus-circle";
import IconPlusCircle from "@/components/icon/icon-plus-circle";
import AnimateHeight from "react-animate-height";
import { useCallback, useState } from "react";
import { OriginalData, SelectedSubtasks, TransformedData } from "@/types/types";
import AdvancedTopic from "./AdvancedTopic";
import { useAdvanced } from "./AdvancedContext";

interface ContextTopicsProps {
    content: string;
}

export default function ContextTopics({ content }: ContextTopicsProps) {
    const [active, setActive] = useState<number | null>(0)
    const [selectedSubtasks, setSelectedSubtasks] = useState<SelectedSubtasks>({});
    const { addReport, addMessage } = useAdvanced()

    const generateReport = useCallback(async (selectedSubtasks: SelectedSubtasks) => {
        addMessage({ role: "user", content: "user clicked continue", metadata: null, reports: [] });

        const transformData = (data: OriginalData): TransformedData[] => {
            const result: TransformedData[] = [];

            for (const parentKey in data) {
                if (data.hasOwnProperty(parentKey)) {
                    data[parentKey].forEach((subtask) => {
                        result.push({
                            parentKey,
                            name: subtask.name,
                            prompt: subtask.prompt,
                        });
                    });
                }
            }

            return result;
        };

        const topics = transformData(selectedSubtasks);
        const sliderKeys = Object.keys(selectedSubtasks);

        for (const topic of topics) {
            try {
                const response = await fetch('https://pvanand-search-generate-prod.hf.space/generate_report', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'text/plain',
                    },
                    body: JSON.stringify({
                        description: topic.prompt,
                        user_id: "test",
                        user_name: "John Doe",
                        internet: true,
                        output_format: "report_table",
                        data_format: "Structured data",
                        generate_charts: true,
                        output_as_md: true,
                    }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                if (response.body) {
                    const reader = response.body.getReader();
                    const decoder = new TextDecoder();
                    let markdown = '';
                    let metadata = '';
                    let isReadingMetadata = false;

                    while (true) {
                        const { value, done } = await reader.read();
                        if (done) break;

                        const chunk = decoder.decode(value, { stream: true });

                        if (chunk.includes('<report-metadata>')) {
                            isReadingMetadata = true;
                            metadata = '';
                        }

                        if (isReadingMetadata) {
                            metadata += chunk;
                            if (chunk.includes('</report-metadata>')) {
                                isReadingMetadata = false;
                            }
                        } else {
                            markdown += chunk;
                            addReport({ role: 'assistant', content: markdown, metadata: metadata, name: topic.name, parentKey: topic.parentKey, report: markdown, sliderKeys: sliderKeys });
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching report:", error);
                addMessage({ role: "assistant", content: "Failed to generate report.", metadata: null, reports: [] });
            }
        }
    }, [addMessage, addReport]);
    return (
        <div className="w-full">
            <h1>Select the topics to be included in the Report</h1>
            <div className="flex">
                <div className="divide-y divide-white-light px-6 py-4.5 dark:divide-dark w-[50%]">
                    {JSON.parse(content)?.map((task, i) => (

                        <div key={i}>
                            <div
                                className={`flex cursor-pointer items-center justify-between gap-10 px-2.5 py-2 text-base font-semibold hover:bg-primary-light hover:text-primary dark:text-white dark:hover:bg-[#1B2E4B] dark:hover:text-primary
            ${active === i + 1 ? 'bg-primary-light !text-primary dark:bg-[#1B2E4B]' : ''}`}
                                onClick={() => setActive(active === i + 1 ? null : i + 1)}
                            >
                                <span>{task.task}</span>
                                {active !== i + 1 ? (
                                    <span className="shrink-0">
                                        <IconPlusCircle duotone={false} />
                                    </span>
                                ) : (
                                    <span className="shrink-0">
                                        <IconMinusCircle fill={true} />
                                    </span>
                                )}
                            </div>
                            <AnimateHeight duration={300} height={active === i + 1 ? 'auto' : 0}>
                                <div className="px-1 py-3 font-semibold text-white-dark">
                                    <AdvancedTopic
                                        currentTopic={task}
                                        selectedSubtasks={selectedSubtasks}
                                        setSelectedSubtasks={setSelectedSubtasks}
                                        key={i}
                                    />
                                </div>
                            </AnimateHeight>
                        </div>
                    ))}
                </div>
                <div className=" h-full sm:h-full justify-center items-center flex   text-white pt-5 w-[50%]">
                    <div className="px-3 py-3 bg-black rounded-3xl w-full">

                        <div className="w-full h-[65vh] custom-scrollbar  pt-2 pl-2 pr-4 overflow-y-auto">
                            {Object.entries(selectedSubtasks).map(([key, value], i) => (
                                <div key={i} className=" w-full">
                                    <div
                                        key={i}
                                        className="border-b-2 py-2  text-xl border-gray-700 w-full"
                                    >
                                        {value.length !== 0 ? key : null}
                                    </div>
                                    {value.map((item, j) => (
                                        <div key={j} className="ml-5 py-1 pt-4">
                                            <h1>{item.name}</h1>
                                            <p className="text-sm text-gray-400">{item.prompt}</p>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <button className="p-2 rounded-md bg-black text-white" onClick={() => generateReport(selectedSubtasks)}>continue</button>
        </div>
    )
}
