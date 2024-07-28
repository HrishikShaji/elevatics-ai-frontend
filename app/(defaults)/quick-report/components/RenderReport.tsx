import { MutableRefObject, useRef, useState } from "react";
import StreamReport from "./StreamReport";

interface RenderReportProps {
    data: string;
    reportId: string;
}

export default function RenderReport({ data, reportId }: RenderReportProps) {
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

        <div onScroll={onScroll} ref={containerRef} className="flex justify-center  max-h-[calc(100vh_-_40px)] overflow-y-auto custom-scrollbar" >
            <StreamReport reportId={reportId} setLineAdded={setLineAdded} handleScroll={handleScroll} report={data} />
        </div>
    )
}
