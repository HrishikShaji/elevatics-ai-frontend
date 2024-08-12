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
        setGraphData(parsedGraph);
    }, [chat.content]);

    return (
        <Plot
            data={graphData.data}
            layout={graphData.layout}
            config={{ responsive: true }}
            style={{ width: '100%', height: '100%' }}
        />
    );
};
