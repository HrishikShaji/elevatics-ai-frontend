//@ts-ignore
import Plot from "react-plotly.js";
import React from 'react';

interface RenderChartProps {
    data: Record<string, any>;
    layout: Record<string, any>;
}

const RenderChart = React.memo(({ data, layout }: RenderChartProps) => {
    console.log("rerendered", layout.title)
    return <Plot className="rounded-3xl" data={data} layout={layout} />
});

export default RenderChart;
