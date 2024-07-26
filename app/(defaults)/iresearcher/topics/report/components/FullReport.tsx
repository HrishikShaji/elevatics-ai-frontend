
"use client"

import { useEffect, useRef, useState } from "react"
import { useResearcher } from "@/contexts/ResearcherContext";
import MainTopic from "./MainTopic";
import { RefObject } from "@fullcalendar/core/preact";
import useSaveReport from "@/hooks/useSaveReport";
import SliderTabs from "./SliderTabs";
import { Loader } from "@/components/Loader";
import { reportLoadingSteps } from "@/lib/loadingStatements";
type Subtask = {
    name: string;
    prompt: string;
};

type OriginalData = {
    [key: string]: Subtask[];
};


const fetchData = async ({ name, prompt }: { name: string, prompt: string }) => {
    const headers = {
        "Content-Type": "application/json",
    };
    const response = await fetch("https://pvanand-search-generate-staging.hf.space/generate_report", {
        method: "POST",
        cache: "no-store",
        headers: headers,
        body: JSON.stringify({
            topic: name,
            description: prompt,
            user_id: "",
            user_name: "",
            internet: true,
            output_format: "report",
            data_format: "No presets",
            generate_charts: true,
            output_as_md: true
        }),
    })

    return response.json()

};

export default function FullReport() {
    const { topics } = useResearcher();
    const itemRefs = useRef<(HTMLElement | null)[][]>([]);
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(new Array(topics.length).fill(false));
    const [completedIndexes, setCompletedIndexes] = useState<number[]>([0]);
    const [isFetchComplete, setIsFetchComplete] = useState(false)
    const { mutate } = useSaveReport()
    const { prompt } = useResearcher()

    const groupedData = topics.reduce((acc: any, item, index) => {
        const { parentKey } = item;

        const existingEntry = acc.find((entry: any) => entry.parentKey === parentKey);

        if (existingEntry) {
            existingEntry.indexes.push(index);
        } else {
            acc.push({ parentKey, indexes: [index] });
        }

        return acc;
    }, []);

    const [selectedTopic, setSelectedTopic] = useState(groupedData[0]?.parentKey || '');
    useEffect(() => {
        let k = 0
        const fetchAllData = async () => {

            for (let i = 0; i < topics.length; i++) {
                setLoading(prevLoading => {
                    const newLoading = [...prevLoading];
                    newLoading[i] = true;
                    return newLoading;
                });
                const result = await fetchData(topics[i]);
                setData(prevData => {
                    const newData: any[] = [...prevData];
                    newData[i] = result;
                    return newData;
                });
                setLoading(prevLoading => {
                    const newLoading = [...prevLoading];
                    newLoading[i] = false;
                    return newLoading;
                });
            }
            setIsFetchComplete(prev => !prev)

        };
        fetchAllData()
    }, [topics]);

    useEffect(() => {
        if (isFetchComplete) {
            mutate({ reportId: '', name: prompt, report: JSON.stringify(data), reportType: "FULL" });
        }
    }, [isFetchComplete, data, mutate, prompt])


    const handleComplete = (index: number) => {
        setCompletedIndexes(prev => [...prev, index])
    };

    const getAllInnerHTML = () => {
        const innerHTMLArray: any[] = [];
        itemRefs.current.forEach((groupRefs: any) => {
            groupRefs.forEach((ref: any) => {
                if (ref) {
                    innerHTMLArray.push({
                        id: ref.id,
                        innerHTML: ref.innerHTML1267

                    });
                }
            });
        });
        return innerHTMLArray;
    };



    return (
        <div className="h-full pt-[10px] w-full flex flex-col  items-center justify-center">
            <SliderTabs setSelectedTopic={setSelectedTopic} options={groupedData} />
            <div className="flex gap-2">
                {loading[0] ? <Loader steps={reportLoadingSteps} /> : groupedData.map((group: any, i: number) => (
                    <MainTopic key={i} indexes={group.indexes} selectedTopic={selectedTopic} parentKey={group.parentKey} completedIndexes={completedIndexes} data={data} itemRefs={itemRefs} index={i} handleComplete={handleComplete} />
                ))}
            </div>
            <button onClick={() => console.log(getAllInnerHTML())}>Get InnerHTML</button>
        </div>
    );
}
