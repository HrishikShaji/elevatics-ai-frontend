
import { ChangeEvent, FormEvent, memo, useCallback, useEffect, useState } from "react"
import { PiRocketLaunchThin } from "react-icons/pi"
import AnimateHeight from "react-animate-height"
import useSuggestions from "@/hooks/useSuggestions";
import { useDocument } from "../contexts/DocumentContext";
import { DOCUMIND_INITIATE, DOCUMIND_RESPONSE } from "@/lib/endpoints";
import { v4 as uuidv4 } from 'uuid';

interface DocumentSearchBarProps {
    title: string;
    subTitle: string;
    disable: boolean;
}

const suggestions = ["Find the Latest research about AI", "What is high-yield savings account?", "Market size and growth projections for EV", "Market share analysis for space exploration"]

const DocumentSearchBar = memo(({ disable, title, subTitle }: DocumentSearchBarProps) => {
    const [input, setInput] = useState("")
    const [initialSearch, setInitialSearch] = useState(false)
    const [inputClick, setInputClick] = useState(false)
    const { data, mutate } = useSuggestions(input)
    const [conversationId, setConversationId] = useState("")
    const [selectedFiles, setSelectedFiles] = useState([]);
    const { sendMessage } = useDocument()
    const [query, setQuery] = useState("")

    useEffect(() => {
        const conversationID = uuidv4();
        setConversationId(conversationID)
    }, [])

    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value)
    }, [])

    const handleReset = useCallback(() => {
        setInput("")
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
        setInitialSearch(true)
        sendMessage({ input: input, agent: "documind" });
        handleReset()
    }

    // Handle file selection
    const handleFileChange = (event) => {
        setSelectedFiles(event.target.files);
    };

    // Convert file to base64
    const encodeFileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]); // Get only the base64 string
            reader.onerror = (error) => reject(error);
        });
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (selectedFiles.length === 0) {
            alert('Please select a file!');
            return;
        }

        const fileNames = [];
        const fileTypes = [];
        const fileData = [];

        // Process each file
        for (const file of selectedFiles) {
            fileNames.push(file.name);
            fileTypes.push(file.type.split('/')[1]); // Extract file extension
            const base64String = await encodeFileToBase64(file);
            fileData.push(base64String);
        }

        // Prepare the data object
        const data = {
            ConversationID: conversationId,
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
            console.log('Success:', result);
            alert('Files uploaded successfully!');
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to upload files.');
        }
    };


    const handleQuery = async (e: FormEvent) => {
        e.preventDefault()

        try {

            const response = await fetch(DOCUMIND_RESPONSE, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ConversationID: conversationId, Query: query })
            })
            const result = await response.text()
            console.log('Success:query', result);
        } catch (error) {
            console.log("error", error)
        }
    }

    return (
        <>
            {!initialSearch && !disable ?
                <div className='flex flex-col w-full   items-center justify-center '>
                    <div className="h-[35vh] flex flex-col items-center gap-3 justify-end">
                        <h1 className="text-3xl font-semibold">
                            {title}
                        </h1>
                        <h1 className="text-[#8282AD] text-center">
                            {subTitle}
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
                : null}
            <div className="w-full flex pt-3 justify-center h-20 items-start">
                <div className="w-[1000px]  bg-white   rounded-3xl dark:bg-neutral-700 overflow-hidden border-gray-200 border-2 shadow-lg focus:outline-gray-300  flex flex-col ">
                    <form onSubmit={handleSubmit}>
                        <input type="file" multiple onChange={handleFileChange} />
                        <button type="submit">Upload</button>
                    </form>
                    <form onSubmit={handleQuery}>
                        <input type="text" multiple onChange={(e) => setQuery(e.target.value)} />
                        <button type="submit">send query</button>
                    </form>
                    <form onSubmit={onSubmit} className=" relative  flex items-center justify-center  ">
                        <input
                            onClick={handleInputClick}
                            value={input}
                            onChange={handleChange}
                            placeholder="What's on your mind..."
                            className="   pr-28  bg-white focus:outline-none p-4 w-full"
                        />{" "}

                        <button
                            className="text-gray-400 hover:bg-gray-300 hover:scale-125 duration-500 absolute glow p-2 group cursor-pointer rounded-full bg-gray-100  right-2 "
                        >
                            <PiRocketLaunchThin size={20} className="text-gray-500 group-hover:text-white duration-500" />
                        </button>
                    </form>
                    {!disable ?
                        <AnimateHeight height={data.length > 0 && !initialSearch ? 300 : 0} duration={300}>
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
        </>
    )
})

export default DocumentSearchBar
