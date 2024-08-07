//@ts-ignore
import Plot from "react-plotly.js";
import React, { memo, useEffect, useState, useCallback } from 'react';
import Image from "next/image";

interface RenderChartProps {
    scriptContent: string;
}

const RenderChart = memo(({ scriptContent }: RenderChartProps) => {
    const [chartData, setChartData] = useState<any>(null);
    const [chartLayout, setChartLayout] = useState<any>(null);
    const [isComplete, setIsComplete] = useState(false);

    const extractObject = useCallback((variableName: string, str: string) => {
        const regex = new RegExp(`var ${variableName} = (.*?);`, 's');
        const match = regex.exec(str);
        if (match && match[1]) {
            const jsonString = match[1]
                .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?\s*:/g, '"$2":')
                .replace(/'/g, '"')
                .replace(/,\s*}/g, '}')
                .replace(/,\s*]/g, ']');
            try {
                return JSON.parse(jsonString);
            } catch (error) {
                console.error(`Error parsing JSON for ${variableName}:`, error, jsonString);
                return null;
            }
        }
        return null;
    }, []);

    useEffect(() => {
        const regex = /Plotly\.newPlot\('.*', data, layout\);/;
        if (regex.test(scriptContent)) {
            const completeScript = scriptContent.replace(/Plotly\.newPlot\(.*\);/, '');
            const parsedData = extractObject('data', completeScript);
            const parsedLayout = extractObject('layout', completeScript);

            if (
                JSON.stringify(parsedData) !== JSON.stringify(chartData) ||
                JSON.stringify(parsedLayout) !== JSON.stringify(chartLayout)
            ) {
                setChartData(parsedData);
                setChartLayout(parsedLayout);
                setIsComplete(true);
                console.log("Chart rendered", { parsedData, parsedLayout });
            }
        }
    }, [scriptContent, extractObject, chartData, chartLayout]);

    if (!isComplete) return null;
    return <Image alt="" height={1000} width={1000} className="h-[300px] w-[400px" src={`https://images.unsplash.com/photo-1487088678257-3a541e6e3922?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8c3VidGxlJTIwYmFja2dyb3VuZHxlbnwwfHwwfHx8MA%3D%3D`} />;
});

export default RenderChart;
