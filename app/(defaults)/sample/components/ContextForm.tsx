import { ChangeEvent, FormEvent, memo, useCallback, useState } from "react"
import { PiRocketLaunchThin } from "react-icons/pi"
import { useAdvanced } from "./AdvancedContext";
import { HFSPACE_TOKEN, TOPICS_URL } from "@/lib/endpoints";

interface ContextFormProps {
    handleInitialSearch: () => void;
    handleInitialClick: () => void;
}

const ContextForm = memo(({ handleInitialSearch, handleInitialClick }: ContextFormProps) => {
    const { setTopicsLoading, addMessage } = useAdvanced()
    const [input, setInput] = useState("")
    console.log("context form rendered")
    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value)
    }, [])

    const handleReset = useCallback(() => {
        setInput("")
    }, [])
    const generateTopics = async (input: string) => {
        setTopicsLoading(true);
        addMessage({ role: "user", content: input, metadata: null, reports: [] });

        try {
            const headers = {
                Authorization: HFSPACE_TOKEN,
                "Content-Type": "application/json",
            };
            const response = await fetch(TOPICS_URL, {
                method: "POST",
                cache: "no-store",
                headers: headers,
                body: JSON.stringify({
                    user_input: input,
                    num_topics: 5,
                    num_subtopics: 3,
                }),
            });

            if (!response.ok) {
                throw new Error("Error fetching topics");
            }

            const result = await response.json();
            addMessage({ role: "options", content: JSON.stringify(result.topics), metadata: null, reports: [] });
        } catch (error) {
            addMessage({ role: "assistant", content: "Oops.", metadata: null, reports: [] });
        } finally {
            setTopicsLoading(false);
        }
    };
    function onSubmit(e: FormEvent) {
        e.preventDefault()
        handleInitialSearch()
        generateTopics(input)
        handleReset()
    }
    return (
        <form onSubmit={onSubmit} className=" relative  flex items-center justify-center  ">
            <input
                onClick={handleInitialClick}
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

    )
})

export default ContextForm
