"use client"
import { ChangeEvent, FormEvent, memo, useCallback, useEffect, useRef, useState } from "react"
import { PiRocketLaunchThin } from "react-icons/pi"
import AnimateHeight from "react-animate-height"
import useSuggestions from "@/hooks/useSuggestions";
import { DOCUMIND_INITIATE } from "@/lib/endpoints";
import { IoCloseCircle } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useResearcher } from "@/contexts/ResearcherContext";
import IconPlus from "@/components/icon/icon-plus";
import { agents } from "@/lib/constants";


const suggestions = ["Find the Latest research about AI", "What is high-yield savings account?", "Market size and growth projections for EV", "Market share analysis for space exploration"]


const ResearcherHome = memo(() => {
    const [input, setInput] = useState("")
    const [initialSearch, setInitialSearch] = useState(false)
    const [inputClick, setInputClick] = useState(false)
    const { data, mutate } = useSuggestions(input)
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const inputRef = useRef<HTMLInputElement>(null)
    const [isOpen, setIsOpen] = useState(false)
    const uploadContainerRef = useRef<HTMLDivElement>(null);
    const router = useRouter()
    const { setPrompt } = useResearcher()
    const agent = agents["FULL"]

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

    function handleSubmit() {
        setPrompt(input)
        router.push("/agents/researcher-agent/topics")
    }
    function onSubmit(e: FormEvent) {
        e.preventDefault()
        setInitialSearch(true)
        if (selectedFiles.length > 0) {
            handleFileSubmit()
        } else {
            if (input !== "") {
                handleSubmit()
            }
        }
        handleReset()
    }

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const files = Array.from(event.target.files)
            setSelectedFiles(files);
        }
    };

    const encodeFileToBase64 = (file: File) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = () => {
                if (reader.result) {
                    const base64String = (reader.result as string).split(',')[1];
                    resolve(base64String);
                } else {
                    reject(new Error('FileReader result is null.'));
                }
            };

            reader.onerror = (error) => {
                reject(new Error(`FileReader error: ${error}`));
            };
        });
    };

    const handleFileSubmit = async () => {
        if (selectedFiles) {

            if (selectedFiles.length === 0) {
                alert('Please select a file!');
                return;
            }

            const fileNames = [];
            const fileTypes = [];
            const fileData = [];

            for (const file of selectedFiles) {
                fileNames.push(file.name);
                fileTypes.push(file.type.split('/')[1]);
                const base64String = await encodeFileToBase64(file);
                fileData.push(base64String);
            }
            const data = {
                ConversationID: "",
                FileNames: fileNames,
                FileTypes: fileTypes,
                FileData: fileData,
            };

            try {
                const response = await fetch(DOCUMIND_INITIATE, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                })
                const result = await response.json()
            } catch (error) {
                alert('Failed to upload files.');
            }
        }
    };


    const handleClick = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };

    return (
        <>
            <div className='flex flex-col w-full   items-center justify-center '>
                <div className="h-[35vh] flex flex-col items-center gap-3 justify-end">
                    <h1 className="text-3xl font-semibold">
                        {agent.name}
                    </h1>
                    <h1 className="text-[#8282AD] text-center">
                        {agent.tagLine}
                    </h1>
                </div>
                <AnimateHeight height={inputClick ? 0 : "auto"} duration={500}>
                    < div className="flex  gap-4 items-center w-[800px] h-[calc(65vh_-_80px)]">
                        {suggestions.map((item, i) => (
                            <div onClick={() => handleRecommendationClick(item)} key={i} className='cursor-pointer h-[150px] transition duration-300 hover:-translate-y-3 w-full hover:bg-gray-200 hover:text-black rounded-3xl shadow-gray-300 p-5 text-gray-500 pt-10 shadow-3xl'>{item}</div>
                        ))}
                    </div>
                </AnimateHeight>
            </div>
            <div className="w-full flex pt-3 justify-center h-20 items-start">
                <div className="w-[1000px] bg-white flex flex-col rounded-3xl border-2 border-gray-200 shadow-lg">
                    <form onSubmit={onSubmit} className=" relative  flex items-center justify-center ">
                        <div ref={uploadContainerRef} className={`absolute -top-10 left-0 z-40 p-2 bg-gray-200 rounded-md duration-500 transition ${isOpen ? "translate-x-0 opacity-100" : "translate-x-100 opacity-0"}`}>
                            <button type="button" className=" rounded-md " onClick={handleClick}>Upload File</button>
                        </div>
                        <input
                            type="file"
                            hidden
                            ref={inputRef}
                            onChange={handleFileChange}
                            className="rounded-3xl border-2 pr-28 shadow-md border-gray-100 bg-white focus:outline-gray-300 p-4 w-full"
                        />{" "}
                        <button type="button"
                            className="text-gray-400 disabled:cursor-auto hover:bg-gray-300 hover:scale-125 duration-500 absolute left-2 glow p-2 group cursor-pointer  rounded-full bg-gray-100   "
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsOpen(prev => !prev)
                            }}>
                            <IconPlus />
                        </button>
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
                                onClick={handleInputClick}
                                value={input}
                                onChange={handleChange}
                                placeholder="What's on your mind..."
                                className=" rounded-3xl py-4 px-16  focus:outline-none w-full"
                            />}

                        <button
                            className="text-gray-400 disabled:cursor-auto hover:bg-gray-300 hover:scale-125 duration-500 absolute glow p-2 group cursor-pointer rounded-full bg-gray-100  right-2 "
                        >
                            <PiRocketLaunchThin size={20} className="text-gray-500 group-hover:text-white duration-500" />
                        </button>
                    </form>
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
                    </AnimateHeight>
                </div>
            </div>
        </>
    )
})

export default ResearcherHome
