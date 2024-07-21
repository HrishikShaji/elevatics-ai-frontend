
import { useState, useEffect } from 'react';
//@ts-ignore
import Plot from "react-plotly.js";

interface StreamChartProps {
    chartData: string;
    onComplete: () => void;
}

function extractChartData(chart: string) {
    const scriptContentMatch = chart.match(/<script[\s\S]*?>([\s\S]*?)<\/script>/);
    if (!scriptContentMatch) return null;

    const scriptContent = scriptContentMatch[1];

    const cleanedScriptContent = scriptContent.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '');

    const dataMatch = cleanedScriptContent.match(/var data = ([\s\S]*?);/);
    const layoutMatch = cleanedScriptContent.match(/var layout = ([\s\S]*?);/);

    if (dataMatch && layoutMatch) {
        try {
            const data = new Function(`return ${dataMatch[1]}`)();
            const layout = new Function(`return ${layoutMatch[1]}`)();
            return { data, layout };
        } catch (error) {
            console.error('Error parsing chart data:', error);
            return null;
        }
    } else {
        return null;
    }
}

function transformPlotlyData(plotlyData: any) {
    if (!plotlyData || !plotlyData.data || !plotlyData.data[0]) {
        return null;
    }

    const type = plotlyData.data[0].type;
    let transformedData;

    if (type === 'scatter') {
        if (!plotlyData.data[0].x || !plotlyData.data[0].y) {
            return null;
        }
        transformedData = plotlyData.data[0].x.map((xValue: string, index: number) => ({
            x: xValue,
            y: plotlyData.data[0].y[index],
        }));

        return {
            type,
            data: transformedData,
            color: plotlyData.data[0].marker?.color || '#8884d8',
            title: plotlyData.layout?.title?.text || 'Untitled Chart',
            xAxisLabel: plotlyData.layout?.xaxis?.title?.text || 'X',
            yAxisLabel: plotlyData.layout?.yaxis?.title?.text || 'Y',
        };
    }

    if (!plotlyData.data[0].x || !plotlyData.data[0].y) {
        return null;
    }
    transformedData = plotlyData.data[0].x.map((xValue: string, index: number) => ({
        name: xValue,
        value: plotlyData.data[0].y[index],
    }));

    return {
        type,
        data: transformedData,
        color: plotlyData.data[0].marker?.color || '#8884d8',
        title: plotlyData.layout?.title?.text || 'Untitled Chart',
        xAxisLabel: plotlyData.layout?.xaxis?.title?.text || 'X',
        yAxisLabel: plotlyData.layout?.yaxis?.title?.text || 'Y',
    };
}

export default function StreamChart({ chartData, onComplete }: StreamChartProps) {
    const [chartObject, setChartObject] = useState<any>(null);
    const [transformedData, setTransformedData] = useState<any>(null);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        const obj = extractChartData(chartData);
        setChartObject(obj);
    }, [chartData]);

    useEffect(() => {
        if (chartObject) {
            const transformed = transformPlotlyData(chartObject);
            setTransformedData(transformed);
        }
    }, [chartObject]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isComplete) {
                setIsComplete(true);
                onComplete();
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [chartData, onComplete, isComplete]);


    return (
        <div className="w-full p-5 rounded-3xl h-full">
            {chartObject ? (
                <div className='w-full h-full'>
                    <Plot className="h-full w-full" data={chartObject.data} layout={chartObject.layout} />
                </div>
            ) : null}
        </div>
    );
}
