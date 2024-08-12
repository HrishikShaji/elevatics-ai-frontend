import { Chat } from "@/types/types"
import { useEffect, useState } from "react";
import Plot from 'react-plotly.js';
interface ChatPlotlyProps {
    chat: Chat
}

export default function ChatPlotly({ chat }: ChatPlotlyProps) {
    const [graphData, setGraphData] = useState<any>({ data: [], layout: {} });

    useEffect(() => {
        const parsedGraph = JSON.parse(chat.content);
        console.log("data is", parsedGraph.data)
        console.log("layout is", parsedGraph.layout)
        setGraphData(parsedGraph);
    }, [chat.content]);

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
