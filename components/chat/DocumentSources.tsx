import React, { useEffect, useState, MouseEvent } from 'react';
import AnimateHeight from 'react-animate-height';
import IconPlusCircle from '../icon/icon-plus-circle';
import IconMinusCircle from '../icon/icon-minus-circle';
import ChatMarkdownRender from './ChatMarkdownRender';


interface DocumentReferencesProps {
    metadata: string;
}

const DocumentReferences: React.FC<DocumentReferencesProps> = ({ metadata }) => {
    const [active, setActive] = useState<number | null>(null)

    function handleClick() {
        setActive(active === 1 ? null : 1)
    }
    return (
        <div className="w-full divide-y divide-white-light   dark:divide-dark">
            <div
                className={`flex cursor-pointer items-center justify-between gap-10  py-2 text-base font-semibold  hover:text-primary dark:text-white dark:hover:bg-[#1B2E4B] dark:hover:text-primary
            ${active === 1 ? ' !text-primary dark:bg-[#1B2E4B]' : ''}`}
                onClick={handleClick}
            >

                <span>References</span>
                {active !== 1 ? (
                    <span className="shrink-0">
                        <IconPlusCircle duotone={false} />
                    </span>
                ) : (
                    <span className="shrink-0">
                        <IconMinusCircle fill={true} />
                    </span>
                )}
            </div>
            <AnimateHeight duration={300} height={active === 1 ? 'auto' : 0}>
                <div className='py-5 '>
                    <div className=" px-1  font-semibold  ">
                        <ChatMarkdownRender text={metadata} disableTyping={true} />

                    </div>
                </div>
            </AnimateHeight>
        </div>
    );
};

export default DocumentReferences;
