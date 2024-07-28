

import { Dispatch, Fragment, SetStateAction, useEffect, useRef, useState } from "react"
import StreamChart from "./StreamChart";
import StreamMarkdown from "./StreamMarkdown";
import DownloadPdfButton from "./DownloadPdfButton";
import { useQuickReport } from "@/contexts/QuickReportContext";
import { marked } from "marked";
import ShareModal from "@/components/ShareModal";

interface StreamReportProps {
    reportId: string;
    report: string;
    handleScroll: () => void;
    setLineAdded: Dispatch<SetStateAction<boolean>>
}

export default function StreamReport({ reportId, setLineAdded, handleScroll, report }: StreamReportProps) {
    const [htmlArray, setHtmlArray] = useState<string[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const { prompt } = useQuickReport()
    const reportRef = useRef<HTMLDivElement | null>(null)
    useEffect(() => {
        const cleanedMarkdown = cleanMarkdown(report);
        const htmlArray = splitMarkdownIntoArray(cleanedMarkdown);
        setHtmlArray(htmlArray);
    }, [report]);

    function getHtmlFromMarkdown(markdownContent: string) {
        const htmlWithoutReportTag = markdownContent.replace(/<\/?report>/g, '');
        return marked(htmlWithoutReportTag);
    }
    function cleanMarkdown(markdownContent: string) {
        const htmlWithoutReportTag = markdownContent.replace(/<\/?report>/g, '');
        const cleanedContent = htmlWithoutReportTag
            .split('\n')
            .filter(line => !line.match(/<div id=".*"><\/div>/) && !line.match(/<script src=".*"><\/script>/))
            .join('\n');
        return cleanedContent;
    }
    function splitMarkdownIntoArray(markdownContent: string) {
        const parts = markdownContent.split(/(<script>[\s\S]*?<\/script>)/);
        return parts.filter(part => part.trim() !== '');
    }
    function handleHtmlRenderComplete() {
        setCurrentIndex(prev => prev + 1)
        setLineAdded(prev => !prev)
    }



    return (
        <div className="flex h-full flex-col items-end gap-5 py-10">
            <div ref={reportRef} className="rounded-3xl bg-gray-100 h-full w-[90vw] sm:w-[800px] p-10">

                {htmlArray.map((html, i) => (
                    <Fragment key={i}>
                        {i <= currentIndex ? (
                            html.startsWith('<script>') && html.endsWith('</script>') ? (
                                <StreamChart chartData={html} onComplete={handleHtmlRenderComplete} />
                            ) : (
                                <StreamMarkdown
                                    handleScroll={handleScroll}
                                    setLineAdded={setLineAdded}
                                    content={html}
                                    speed={.1}
                                    fullComplete={i === htmlArray.length - 1}
                                    handleFullComplete={() => { }}
                                    onComplete={handleHtmlRenderComplete}

                                />
                            )
                        ) : null}
                    </Fragment>
                ))}
            </div>
            <div className="flex gap-4">
                <DownloadPdfButton htmlArray={[["", getHtmlFromMarkdown(report) as string]]} prompt={prompt} />
                <ShareModal reportId={reportId} type="QUICK" />
            </div>
        </div>
    )
}
