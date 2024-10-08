//@ts-ignore
import Plot from "react-plotly.js";
import React, { memo, useEffect, useState, useCallback } from 'react';

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
            }
        }
    }, [scriptContent, extractObject, chartData, chartLayout]);

    if (!isComplete) return null;
    return <div className="rounded-3xl overflow-hidden bg-white">
        <Plot className="rounded-3xl" data={chartData} layout={chartLayout} />  </div>;
});

export default RenderChart;
