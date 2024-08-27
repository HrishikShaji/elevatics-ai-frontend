import { BiRightArrowAlt } from "react-icons/bi";
import { ChangeEvent, FormEvent, memo, useCallback, useEffect, useRef, useState } from "react"
import { PiRocketLaunchThin } from "react-icons/pi"
import AnimateHeight from "react-animate-height"
import useSuggestions from "@/hooks/useSuggestions";
import { useChat } from "@/contexts/ChatContext";
import { ChatType } from "@/types/types";
import IconPlus from "../icon/icon-plus";
import { IoCloseCircle } from "react-icons/io5";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { agents } from "@/lib/constants";
import AgentLoader from "./AgentLoader";
import { useAccount } from "@/contexts/AccountContext";
import SignInModal from "../SignInModal";
import PlanModal from "../PlanModal";
import Image from "next/image";

interface ChatSearchBarProps {
    title: string;
    subTitle: string;
    disable: boolean;
    responseType: ChatType;
    suggestions: string[];
}



const ChatSearchBar = memo(({ suggestions, disable, title, subTitle, responseType }: ChatSearchBarProps) => {
    const [input, setInput] = useState("")
    const [initialSearch, setInitialSearch] = useState(false)
    const [inputClick, setInputClick] = useState(false)
    const { data, mutate } = useSuggestions(input)
    const { setSelectedFiles, uploadFile, selectedFiles, sendMessage, loading, chatHistory } = useChat()
    const inputRef = useRef<HTMLInputElement>(null)
    const [isOpen, setIsOpen] = useState(false)
    const uploadContainerRef = useRef<HTMLDivElement>(null);
    const { currentFingerPrint, profile } = useAccount()
    const [signInModal, setSignInModal] = useState(false)
    const [planModal, setPlanModal] = useState(false)
    const pathname = usePathname()
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (uploadContainerRef.current && !uploadContainerRef.current.contains(event.target as any)) {
                setIsOpen(false)
                console.log('Clicked outside the upload container!');
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value)
    }, [])

    function handleRemoveFile(name: string, e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation();
        const updatedFiles = selectedFiles.filter((file) => file.name !== name);
        setSelectedFiles(updatedFiles)
    }

    const handleReset = useCallback(() => {
        setInput("")
        setSelectedFiles([])
    }, [])

    const handleInputClick = useCallback(() => {
        setInputClick(true)
    }, [])

    const handleRecommendationClick = useCallback((recommendation: string) => {
        setInput(recommendation)
        handleInputClick()
        mutate(recommendation)
    }, [])

    function onSubmit(e: FormEvent) {
        e.preventDefault()
        if (!profile?.id) {
            if (currentFingerPrint?.usage && currentFingerPrint.usage >= 3) {
                console.log("sign in ")
                setSignInModal(true)
            } else {
                setInitialSearch(true)
                if (selectedFiles.length > 0) {
                    uploadFile(responseType)
                } else {
                    if (input !== "") {
                        sendMessage({ input: input, responseType: responseType });
                    }
                }
                handleReset()
            }
        } else {
            if (profile.queries <= 0) {
                setPlanModal(true)
                console.log("exhuasted everything")
            } else {

                setInitialSearch(true)
                if (selectedFiles.length > 0) {
                    uploadFile(responseType)
                } else {
                    if (input !== "") {
                        sendMessage({ input: input, responseType: responseType });
                    }
                }
                handleReset()
            }

        }
    }

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const files = Array.from(event.target.files)
            setSelectedFiles(files);
        }
    };


    const handleClick = () => {
        if (inputRef.current && !loading) {
            inputRef.current.click();
        }
    };

    return (
        <>
            <PlanModal modal={planModal} setModal={setPlanModal} />
            <SignInModal modal={signInModal} setModal={setSignInModal} />
            {chatHistory.length === 0 && !disable ?
                <div className='flex flex-col w-full   items-center justify-center '>
                    <div className="h-[40vh] w-[1000px]  flex flex-col gap-3 items-start pt-[20vh] justify-center">
                        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-500">
                            {profile?.name ? `Hello, ${profile.name}` : null}
                        </h1>
                        <h1 className="text-[#C4C7C5] text-4xl text-center">
                            Welcome to Elevatics AI !
                        </h1>
                    </div>
                </div>
                : null}
            <div className="w-full flex  justify-center h-20 z-20 pt-5 items-start">
                <div className="w-[1000px]  flex flex-col rounded-3xl bg-[#F6F6F6]">
                    <form onSubmit={onSubmit} className=" relative  flex items-center justify-center ">
                        <div ref={uploadContainerRef} className={`absolute -top-10 left-0 z-40 p-2 bg-gray-200 rounded-md duration-500 transition ${isOpen ? "translate-x-0 opacity-100" : "translate-x-100 opacity-0"}`}>
                            <button type="button" className=" rounded-md " onClick={handleClick}>Upload File</button>
                        </div>
                        {/*

                        <input
                            type="file"
                            hidden
                            ref={inputRef}
                            onChange={handleFileChange}
                            className="rounded-3xl border-2 pr-28 shadow-md border-gray-100  focus:outline-none p-4 w-full"
                        />{" "}
                        <button type="button"
                            disabled={loading}
                            className="text-gray-400 disabled:cursor-auto hover:bg-gray-300 hover:scale-125 duration-500 absolute left-2 glow p-2 group cursor-pointer  rounded-full bg-gray-100   "
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsOpen(prev => !prev)
                            }}>
                            <IconPlus />
                        </button>
                        */}
                        {selectedFiles.length > 0 ?
                            <div className="flex gap-2 py-4 rounded-3xl px-16 justify-start w-full">{selectedFiles.map((file, i) => <div key={i} className="flex gap-1 items-center">
                                <h1>{file.name}</h1>
                                <button onClick={(e) => handleRemoveFile(file.name, e)}>
                                    <IoCloseCircle />
                                </button>
                            </div>)}
                            </div>
                            :
                            <input
                                disabled={loading}
                                onClick={handleInputClick}
                                value={input}
                                onChange={handleChange}
                                placeholder="What's on your mind..."
                                className=" rounded-3xl py-4 px-8 bg-transparent focus:outline-none w-full"
                            />}
                        <div className="flex gap-2 items-center absolute right-2">
                            <div className="flex gap-2 items-center">
                                <div className="p-1 w-10 rounded-2xl border-[1px] border-[#A1A1A1]">
                                    <div className="h-4 w-4 rounded-full bg-[#A1A1A1]"></div>
                                </div>
                                <h1>Pro</h1>
                            </div>
                            <button
                                disabled={loading}
                                className="disabled:cursor-auto bg-gradient-to-b from-blue-500 to-purple-500 hover:scale-125 duration-500  text-white  p-2 group cursor-pointer rounded-full   "
                            >
                                {loading ? <AgentLoader isLoading={loading} /> :
                                    <BiRightArrowAlt size={20} className="text-white duration-500" />
                                }
                            </button>
                        </div>
                    </form>
                    {!disable ?
                        <AnimateHeight height={data.length > 0 && !initialSearch && selectedFiles.length === 0 ? 300 : 0} duration={300}>
                            <div className="flex flex-col gap-1 p-5 pt-0   bg-transparent w-full">
                                <span className="text-[#535353] ">Here are some suggestions</span>
                                <div className="  w-full overflow-y-auto max-h-[300px] flex flex-col gap-1">
                                    {!initialSearch ? data.map((recommendation: string, i: number) => (
                                        <div
                                            onClick={() => handleRecommendationClick(recommendation)}
                                            key={i}
                                            className="flex cursor-pointer p-1 items-center text-gray-500 gap-5 bg-transparent "
                                        >
                                            <h1 className="bg-gray-100 py-1 px-3 hover:font-semibold rounded-xl">
                                                {recommendation}
                                            </h1>
                                        </div>
                                    )) : null}
                                </div>
                            </div>
                        </AnimateHeight> : null}
                </div>
            </div>
            {chatHistory.length === 0 && !disable ?
                <div className="w-full justify-center h-full items-center flex">
                    <div className="flex gap-5 w-[1000px] overflow-auto hide-scrollbar">{Object.values(agents).map((agent, i) => {
                        if (agent.hidden) return null
                        return (<div className="h-[150px] rounded-2xl w-[250px] bg-gray-300 flex-shrink-0 overflow-hidden relative" key={i}>
                            <div className="absolute bg-[#08022F]/50 h-full w-full flex flex-col gap-1 p-5">
                                <h1 className="text-white text-xl font-semibold">{agent.name}</h1>
                                <h1 className="text-white  ">{agent.tagLine}</h1>
                            </div>
                            <Link href={agent.active ? agent.url : "/"} className="absolute h-6 w-6 rounded-full flex items-center justify-center bg-white bottom-2 right-2">
                                <BiRightArrowAlt />
                            </Link>
                            <Image src={agent.img} alt="agent " width={301} height={157} className="h-full w-full object-cover" />
                        </div>)
                    })}</div>
                </div> : null}
        </>
    )
})

export default ChatSearchBar
