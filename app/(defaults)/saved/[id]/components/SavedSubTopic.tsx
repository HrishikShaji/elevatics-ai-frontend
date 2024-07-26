
import { Fragment, useEffect, useState } from "react";
import { marked } from "marked";
import SavedChart from "./SavedChart";
import SavedMarkdown from "./SavedMarkdown";

interface SavedSubTopicProps {
    name: string;
    report: string;
}

export default function SavedSubTopic({ name, report }: SavedSubTopicProps) {
    const [htmlArray, setHtmlArray] = useState<string[]>([])
    useEffect(() => {
        const cleanedMarkdown = cleanMarkdown(report);
        const htmlArray = splitMarkdownIntoArray(cleanedMarkdown);
        setHtmlArray(htmlArray);
    }, [report]);

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
    return <div>
        {htmlArray.map((html, i) => (
            <Fragment key={i}>
                {
                    html.startsWith('<script>') && html.endsWith('</script>') ? (
                        <SavedChart chartData={html} />
                    ) : (
                        <SavedMarkdown content={html} />
                    )
                }
            </Fragment>
        ))}
    </div>
}
