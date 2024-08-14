import { Chat } from "@/types/types";
import { CAREER_AUTH_TOKEN, CAREER_URL } from "./endpoints";

interface Props {
    resume: File | null;
    resumeText: string;
    jobDescription: string;
    jobDescriptionUrl: string;
    addMessage: (chat: Chat) => void;
}

export default async function fetchCareerRepsonse({ addMessage, resumeText, resume, jobDescriptionUrl, jobDescription }: Props) {
    const formData = new FormData();
    formData.append('resume', resume ? resume : "");
    formData.append('resumeText', resumeText);
    formData.append('jobDescription', jobDescription);
    formData.append('jobDescriptionUrl', jobDescriptionUrl);

    const headers = {
        Authorization: CAREER_AUTH_TOKEN,
    };

    const response = await fetch(CAREER_URL, {
        method: 'POST',
        body: formData,
        headers: {
            'Authorization': `Bearer ${CAREER_AUTH_TOKEN}`
        },
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const result = await response.json()
    addMessage({ role: 'assistant', content: result.optimizedResume, metadata: JSON.stringify(result.metadata), type: "career" });
}
