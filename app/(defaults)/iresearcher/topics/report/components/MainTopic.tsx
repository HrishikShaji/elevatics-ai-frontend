
import { MutableRefObject, useRef, useState } from "react";
import RenderReport from "./RenderReport";

interface MainTopicProps {
    selectedTopic: string;
    parentKey: string;
    indexes: any[];
    itemRefs: MutableRefObject<(HTMLElement | null)[][]>;
    completedIndexes: number[];
    data: any[];
    handleComplete: (item: number) => void;
    index: number;
}

export default function MainTopic({ handleComplete, index, completedIndexes, data, selectedTopic, parentKey, indexes, itemRefs }: MainTopicProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [lineAdded, setLineAdded] = useState(false)
    const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);

    const onScroll = () => {
        const container = containerRef.current;
        if (!container) return;

        const isScrolledToBottom =
            container.scrollHeight - container.scrollTop <= container.clientHeight + 1;
        if (isScrolledToBottom) {
            setIsAutoScrollEnabled(true);
        } else {

            setIsAutoScrollEnabled(false);
        }
    };
    function handleScroll() {
        if (containerRef.current && isAutoScrollEnabled) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }
    return (

        <div onScroll={onScroll} ref={containerRef} className=" p-10 max-h-[70vh] overflow-y-auto" style={{ display: selectedTopic === parentKey ? "block" : "none" }}>
            <div className="bg-gray-300 p-10 rounded-3xl">
                {indexes.map((item: any, j: number) => (
                    <div id={`jojo-${j}`} key={j}
                        ref={el => {
                            if (!itemRefs.current[index]) {
                                itemRefs.current[index] = [];
                            }
                            itemRefs.current[index][j] = el;
                        }}
                    >
                        {data[item] && data[item].report && completedIndexes.includes(item) && (
                            <RenderReport setLineAdded={setLineAdded} handleScroll={handleScroll} handleComplete={handleComplete} item={item} report={data[item].report} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
