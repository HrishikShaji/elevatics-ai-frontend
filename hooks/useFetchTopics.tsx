import { useResearcher } from "@/contexts/ResearcherContext";
import { useSettings } from "@/contexts/SettingsContext";
import { ResearcherTopicsResponse } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useState } from "react";



async function fetchNewTopics({ prompt, topicsNum, subTopicsNum, setData }: { setData: Dispatch<SetStateAction<ResearcherTopicsResponse[]>>, prompt: string, topicsNum: number, subTopicsNum: number }) {
    const token = process.env.NEXT_PUBLIC_HFSPACE_TOKEN || "";
    const headers = {
        Authorization: token,
        "Content-Type": "application/json",
    };
    const response = await fetch(
        "https://pvanand-generate-subtopics.hf.space/generate_topicsv2",
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
    setData(await result)
    return result;
}

export default function useFetchTopics() {
    const { prompt, setData } = useResearcher();
    const { topicsLimit } = useSettings();


    const { data, isLoading, error } = useQuery({
        queryKey: ["topics", prompt],
        queryFn: () => fetchNewTopics({ setData: setData, prompt, topicsNum: topicsLimit.topics, subTopicsNum: topicsLimit.subTopics }),
        enabled: !!prompt
    }
    );

    return { isLoading, data, error };
}
