
import { useAccount } from "@/contexts/AccountContext";
import Image from "next/image";
import Link from "next/link";
import AnimateHeight from "react-animate-height";

interface AgentsContainerProps {
    hasClicked: boolean;
    handleSuggestionsClick: (value: string) => void;
    title: string;
    subTitle: string;
    suggestions: string[];
}

const agents = [{ name: "iresearcher", href: "/iresearcher" }, { name: "investor", href: "/investor" }, { name: "coder", href: "/coder" }, { name: "news", href: "/news" }, { name: "search", href: "/search" }, { name: "document", href: '/documents' }]
const second = [{ name: "iresearcher", href: "/iresearcher", img: "/assets/stepB.png" }, { name: "investor", href: "/investor", img: "/assets/stepB.png" }, { name: "coder", href: "/coder", img: "/assets/stepB.png" }]

export default function AgentsContainer({ hasClicked, handleSuggestionsClick, title, subTitle, suggestions }: AgentsContainerProps) {
    const { profile } = useAccount()

    return (

        <div className='flex flex-col w-full   items-center justify-center '>
            <div className="h-[35vh] flex flex-col items-center gap-3 justify-end">
                <h1 className="text-3xl font-semibold">
                    {profile?.name ? `Hi ${profile?.name}` : "Hi,"}
                </h1>
                <h1 className="text-[#8282AD] text-center">
                    How can i help you today?
                </h1>
            </div>
            < div className="flex justify-start gap-4 overflow-x-hidden items-center w-[900px] h-[calc(65vh_-_80px)]">
                {second.map((item, i) => (
                    <div key={i} className='cursor-pointer w-[700px] flex justify-center items-center flex-col gap-5  duration-300 hover:-translate-y-3  hover:bg-gray-200 hover:text-black rounded-3xl shadow-gray-300 p-5 text-gray-500 pt-10 shadow-3xl'>
                        <h1 className="text-xl">{item.name}</h1>

                    </div>
                ))}
            </div>
        </div>
    )
}
