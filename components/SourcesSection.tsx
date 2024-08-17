
import React, { useEffect, useState, MouseEvent } from 'react';
import AnimateHeight from 'react-animate-height';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import IconMinusCircle from './icon/icon-minus-circle';
import IconPlusCircle from './icon/icon-plus-circle';
import ChatMarkdownRender from './chat/ChatMarkdownRender';


interface SourcesComponentProps {
    metadata: string;
}

const SourcesSection: React.FC<SourcesComponentProps> = ({ metadata }) => {
    const [sources, setSources] = useState<string[][]>([]);
    const [active, setActive] = useState<number | null>(null)
    useEffect(() => {
        const metadataMatch = metadata.match(/all-text-with-urls: (.+)/);
        if (metadataMatch) {
            const metadataObj = JSON.parse(metadataMatch[1]);
            setSources(metadataObj);
        }
    }, [metadata]);

    function handleClick({ index, content }: { index: number, content: string }) {
        if (content.length > 0) {

            setActive(active === index + 1 ? null : index + 1)
        }
    }
    function getHostname(url: string): string | null {
        try {
            const parsedUrl = new URL(url);
            return parsedUrl.hostname;
        } catch (error) {
            console.error("Invalid URL:", error);
            return null;
        }
    } return (
        <div>
            <div className="w-full divide-y divide-white-light   dark:divide-dark">
                {(sources as string[][]).map((task, i) => (
                    <div key={i}>
                        <div
                            className={`flex cursor-pointer items-center justify-between gap-10  py-2 text-base font-semibold  hover:text-primary dark:text-white dark:hover:bg-[#1B2E4B] dark:hover:text-primary
            ${active === i + 1 ? ' !text-primary dark:bg-[#1B2E4B]' : ''}`}
                            onClick={() => handleClick({ index: i, content: task[0] })}
                        >
                            <span>{getHostname(task[1])}</span>
                            {active !== i + 1 ? (
                                <span className="shrink-0">
                                    {task[0].length > 0 ? <IconPlusCircle duotone={false} /> : null}
                                </span>
                            ) : (
                                <span className="shrink-0">
                                    {task[0].length > 0 ?
                                        <IconMinusCircle fill={true} /> : null}
                                </span>
                            )}
                        </div>
                        <AnimateHeight duration={300} height={active === i + 1 ? 'auto' : 0}>
                            <div className='py-5 '>
                                <div className=" px-1  font-semibold  ">
                                    <ChatMarkdownRender text={task[0]} disableTyping={true} />

                                </div>
                            </div>
                        </AnimateHeight>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SourcesSection;
