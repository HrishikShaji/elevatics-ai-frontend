import { Chat } from "@/types/types";
import { HFSPACE_TOKEN, TOPICS_URL } from "./endpoints";

interface Props {
    addMessage: (chat: Chat) => void;
    query: string;
}

export default async function fetchResearcherTopics({ addMessage, query }: Props) {
    const headers = {
        Authorization: HFSPACE_TOKEN,
        "Content-Type": "application/json",
    };
    const response = await fetch(TOPICS_URL, {
        method: "POST",
        cache: "no-store",
        headers: headers,
        body: JSON.stringify({
            user_input: query,
            num_topics: 5,
            num_subtopics: 3,
        }),
    });

    if (!response.ok) {
        throw new Error("Error fetching topics");
    }

    const result = await response.json();
    addMessage({ type: "iresearcher-topics", role: "assistant", content: JSON.stringify(result.topics), metadata: null, reports: [] });

}
