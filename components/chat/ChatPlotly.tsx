import { Chat } from "@/types/types"
import { useEffect, useState } from "react";
import Plot from 'react-plotly.js';
interface ChatPlotlyProps {
    content: string;
}

export default function ChatPlotly({ content }: ChatPlotlyProps) {
    const [graphData, setGraphData] = useState<any>({ data: [], layout: {} });

    useEffect(() => {
        const parsedGraph = JSON.parse(content);
        setGraphData(parsedGraph);
    }, [content]);

    return (
        <div>
            <div className="h-[700px] w-full">
                <Plot
                    data={graphData.data}
                    layout={graphData.layout}
                />
            </div>
        </div>
    );
};
