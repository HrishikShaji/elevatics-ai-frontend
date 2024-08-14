import { useChat } from "@/contexts/ChatContext";
import { Chat } from "@/types/types";
import { FormEvent, useState } from "react";

interface CareerFollowUpProps {
    chat: Chat
}

export default function CareerFollowUp({ chat }: CareerFollowUpProps) {
    const [jobDescription, setJobDescription] = useState('');
    const [jobDescriptionUrl, setJobDescriptionUrl] = useState('');

    const { sendMessage, chatHistory } = useChat()

    function handleSubmit(e: FormEvent) {
        e.preventDefault()
        const input = JSON.stringify({ resumeText: chatHistory[chatHistory.length - 2].content, jobDescriptionUrl, jobDescription })
        sendMessage({ input, responseType: "career-answer" })
    }

    return <form onSubmit={handleSubmit}>
        <div>
            <label htmlFor="jobDescription">Job Description:</label>
            <textarea
                id="jobDescription"
                name="jobDescription"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
            />
        </div>
        <div>
            <label htmlFor="jobDescriptionUrl">Job Description URL:</label>
            <input
                type="url"
                id="jobDescriptionUrl"
                name="jobDescriptionUrl"
                value={jobDescriptionUrl}
                onChange={(e) => setJobDescriptionUrl(e.target.value)}
            />
        </div>
        <button type="submit">Submit</button>
    </form>
}
