
//@ts-ignore
import Plot from "react-plotly.js";
import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

interface ReportContainerProps {
    report: string;
}

const ReportContainer: React.FC<ReportContainerProps> = ({ report }) => {
    return (
        <div id="report-container" className="w-3/5 p-4 border-r border-gray-300">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                    script: ({ node, ...props }) => {
                        if (props.src === "https://cdn.plot.ly/plotly-latest.min.js") {
                            return <div>removed cdn</div>
                        }
                        if (props.children) {
                            const regex = /Plotly\.newPlot\('.*', data, layout\);/;

                            if (regex.test(props.children as string)) {
                                console.log('The line exists in the string.');
                                const modifiedString = (props.children as string).replace(/Plotly\.newPlot\(.*\);/, '')
                                const cleanedScriptContent = modifiedString.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '');

                                const dataMatch = cleanedScriptContent.match(/var data = ([\s\S]*?);/);
                                const layoutMatch = cleanedScriptContent.match(/var layout = ([\s\S]*?);/);

                                if (dataMatch && layoutMatch) {
                                    try {
                                        const data = new Function(`return ${dataMatch[1]}`)();
                                        const layout = new Function(`return ${layoutMatch[1]}`)();
                                        console.log("data:", data)
                                        console.log("layout:", layout)
                                        if (data && layout) {
                                            return <Plot className="rounded-3xl" data={data} layout={{ title: layout.title, width: "100%" }} />
                                        } else {
                                            return null
                                        }

                                    } catch (error) {
                                        console.error('Error parsing chart data:', error);
                                        return null;
                                    }
                                } else {
                                    return null;
                                }
                            } else {
                                console.log('The line does not exist in the string.');
                            }
                        }
                    },
                    div: ({ node, ...props }) => {
                        return <div>got div</div>
                    }
                }}

            >{report}</ReactMarkdown>
        </div>
    );
};

export default ReportContainer;

{/*

*/}
