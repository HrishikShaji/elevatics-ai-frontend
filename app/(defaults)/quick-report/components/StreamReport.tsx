

import { Dispatch, SetStateAction, useEffect, useState } from "react"
import StreamChart from "./StreamChart";
import StreamMarkdown from "./StreamMarkdown";

interface StreamReportProps {
    report: string;
    handleScroll: () => void;
    setLineAdded: Dispatch<SetStateAction<boolean>>
}

export default function StreamReport({ setLineAdded, handleScroll, report }: StreamReportProps) {
    const [htmlArray, setHtmlArray] = useState<string[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        const cleanedMarkdown = cleanMarkdown(report);
        const htmlArray = splitMarkdownIntoArray(cleanedMarkdown);
        setHtmlArray(htmlArray);
    }, [report]);


    function cleanMarkdown(markdownContent: string) {
        const cleanedContent = markdownContent
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
        <div className="rounded-3xl bg-gray-300 p-5">

            {htmlArray.map((html, i) => (
                <div key={i}>
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
                </div>
            ))}
        </div>
    )
}
