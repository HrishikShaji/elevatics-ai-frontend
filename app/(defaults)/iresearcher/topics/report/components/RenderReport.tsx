
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import StreamChart from "./StreamChart";
import StreamMarkdown from "./StreamMarkdown";

interface RenderReportProps {
    report: string;
    handleComplete: (value: number) => void;
    item: number;
    handleScroll: () => void;
    setLineAdded: Dispatch<SetStateAction<boolean>>
}

export default function RenderReport({ setLineAdded, handleScroll, item, report, handleComplete }: RenderReportProps) {
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
    }


    return (
        <>

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
                                handleFullComplete={() => handleComplete(item + 1)}
                                onComplete={handleHtmlRenderComplete}

                            />
                        )
                    ) : null}
                </div>
            ))}
        </>
    )
}
