"use client"

import { useResearcher } from "@/contexts/ResearcherContext"
import useFetchTopics from "@/hooks/useFetchTopics"

export default function TopicSection() {
    const { prompt, data } = useResearcher()
    const { isLoading } = useFetchTopics()

    return <div>{prompt}</div>
}
