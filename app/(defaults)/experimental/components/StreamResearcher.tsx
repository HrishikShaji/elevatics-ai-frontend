"use client"

import { useEffect, useState } from "react"
import { landformTopics } from "../lib/sampleData"

type Topic = {
    isCompleted: boolean;
    name: string;
    parentKey: string;
    prompt: string;
}

export default function StreamResearcher() {
    const [topics, setTopics] = useState<Topic[]>([])
    useEffect(() => {
        console.log("thes are topics", landformTopics)
        const modifiedTopics = landformTopics.map(topic => { return { ...topic, isCompleted: false } })
        setTopics(modifiedTopics)
    }, [])

    async function generateReports() {

    }

    console.log(topics)
    return <div className="flex flex-col gap-10 p-10">
        <button className="p-2 bg-black text-white " onClick={generateReports}>Generate</button>
    </div>
}
