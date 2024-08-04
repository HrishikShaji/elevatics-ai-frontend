import AnimateHeight from "react-animate-height";

interface AgentIntroProps {
    hasClicked: boolean;
    handleSuggestionsClick: (value: string) => void;
    title: string;
    subTitle: string;
    suggestions: string[];
}

export default function AgentIntro({ hasClicked, handleSuggestionsClick, title, subTitle, suggestions }: AgentIntroProps) {
    return (

        <div className='flex flex-col w-full   items-center justify-center '>
            <div className="h-[35vh] flex flex-col items-center gap-3 justify-end">
                <h1 className="text-3xl font-semibold">
                    {title}
                </h1>
                <h1 className="text-[#8282AD] text-center">
                    {subTitle}
                </h1>
            </div>
            <AnimateHeight height={hasClicked ? 0 : "auto"} duration={500}>
                < div className="flex  gap-4 items-center w-[800px] h-[calc(65vh_-_80px)]">
                    {suggestions.map((item, i) => (
                        <div onClick={() => handleSuggestionsClick(item)} key={i} className='cursor-pointer h-[150px] transition duration-300 hover:-translate-y-3 w-full hover:bg-gray-200 hover:text-black rounded-3xl shadow-gray-300 p-5 text-gray-500 pt-10 shadow-3xl'>{item}</div>
                    ))}
                </div>
            </AnimateHeight>
        </div>
    )
}
