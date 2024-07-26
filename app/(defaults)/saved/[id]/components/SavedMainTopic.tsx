

import { MutableRefObject, useRef, useState } from "react";
import SavedSubTopic from "./SavedSubTopic";

interface SavedMainTopicProps {
    selectedTopic: string;
    parentKey: string;
    indexes: any[];
    data: any[];
}

export default function SavedMainTopic({ data, selectedTopic, parentKey, indexes }: SavedMainTopicProps) {

    return (

        <div className="flex justify-center w-full max-h-[calc(100vh_-_200px)] h-full overflow-y-auto" style={{ display: selectedTopic === parentKey ? "block" : "none" }}>
            <div className="flex h-full flex-col items-center  gap-5 py-10">
                <div className="rounded-3xl bg-gray-100 h-full w-[800px] p-10">
                    {indexes.map((item: any, j: number) => (
                        <div id={`jojo-${j}`} key={j}
                        >
                            {data[item] && data[item].report && (
                                <SavedSubTopic name="" report={data[item].report} />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
