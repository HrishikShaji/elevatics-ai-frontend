//@ts-ignore
import Plot from "react-plotly.js";
import React, { useCallback, useEffect, useMemo, useState } from 'react';

interface RenderChartProps {
    scriptContent: string;
}

const RenderChart = React.memo(({ scriptContent }: RenderChartProps) => {
    const [chartData, setChartData] = useState<any>(null);
    const [chartLayout, setChartLayout] = useState<any>(null);

    const extractObject = useCallback((variableName: string, str: string) => {
        const regex = new RegExp(`var ${variableName} = (.*?);`, 's');
        const match = regex.exec(str);
        if (match && match[1]) {
            const jsonString = match[1]
                .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?\s*:/g, '"$2":')
                .replace(/'/g, '"')
                .replace(/,\s*}/g, '}')
                .replace(/,\s*]/g, ']');
            return JSON.parse(jsonString);
        }
        return null;
    }, []);

    useEffect(() => {
        const parsedData = extractObject('data', scriptContent);
        const parsedLayout = extractObject('layout', scriptContent);
        setChartData(parsedData);
        setChartLayout(parsedLayout);
    }, [scriptContent, extractObject]);

    const memoizedChartData = useMemo(() => chartData, [chartData]);
    const memoizedChartLayout = useMemo(() => chartLayout, [chartLayout]);

    if (!memoizedChartData || !memoizedChartLayout) return null;
    return <Plot className="rounded-3xl" data={memoizedChartData} layout={memoizedChartLayout} />
});

export default RenderChart;
