import { useResearcher } from "@/contexts/ResearcherContext";
import { useSettings } from "@/contexts/SettingsContext";
import { HFSPACE_TOKEN, TOPICS_URL } from "@/lib/endpoints";
import { ResearcherTopicsResponse } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useState } from "react";



async function fetchNewTopics({ prompt, topicsNum, subTopicsNum }: { prompt: string, topicsNum: number, subTopicsNum: number }) {
    const headers = {
        Authorization: HFSPACE_TOKEN,
        "Content-Type": "application/json",
    };
    const response = await fetch(
        TOPICS_URL,
        {
            method: "POST",
            cache: "no-store",
            headers: headers,
            body: JSON.stringify({
                user_input: prompt,
                num_topics: topicsNum,
                num_subtopics: subTopicsNum
            }),
        },
    );

    if (!response.ok) {
        throw new Error("Error fetching topics");
    }

    const result = response.json()
    return result;
}

export default function useFetchTopics() {
    const { prompt } = useResearcher();
    const { topicsLimit } = useSettings();


    const { data, isLoading, error } = useQuery({
        queryKey: ["topics", prompt],
        queryFn: () => fetchNewTopics({ prompt, topicsNum: topicsLimit.topics, subTopicsNum: topicsLimit.subTopics }),
        enabled: !!prompt
    }
    );

    return { isLoading, data: data?.topics as ResearcherTopicsResponse[], error };
}
