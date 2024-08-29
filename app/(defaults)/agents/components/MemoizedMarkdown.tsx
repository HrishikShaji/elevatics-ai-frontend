import dynamic from "next/dynamic";
import { memo, useRef } from "react";
import ReactMarkdown, { Components, ExtraProps } from "react-markdown"
import newStyle from "@/styles/new-medium.module.css"
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

const ClientSideChartRender = dynamic(
    () => import('@/components/chat/ChatChartRender'),
    { ssr: false }
);
export const MemoizedMarkdown = memo(({ content, chartData }: { content: string, chartData: string }) => {
    const tableIndex = useRef(0)
    return (
        <div className={newStyle.markdown}>
            <ReactMarkdown
                components={{
                    "status": ({ node, ...props }: ExtraProps) => {
                        return null;
                    },
                    "json": ({ node, ...props }: ExtraProps) => {
                        return null;
                    },
                    "report-metadata": ({ node, ...props }: ExtraProps) => {
                        return null;
                    },
                    "report": ({ node, ...props }: ExtraProps) => {
                        return <div className="" {...props} />;
                    },
                    "report-chart": ({ node, ...props }: ExtraProps) => {
                        return <div className="" {...props} />;
                    },
                    table: memo(({ node, ...props }) => {
                        const currentTableIndex = tableIndex.current;
                        tableIndex.current += 1;
                        return (
                            <div className="flex flex-col gap-2">
                                <table id="999" {...props} />
                            </div>
                        );
                    }),
                    script: memo(({ node, src, children }) => {
                        if (src === "https://cdn.plot.ly/plotly-latest.min.js") {
                            return null;
                        }
                        return (
                            <div className="flex flex-col gap-2">
                                <ClientSideChartRender scriptContent={children as string} />
                            </div>
                        );
                    }),
                    div: ({ node, ...props }) => {
                        return null;
                    },
                } as Components}
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
});
