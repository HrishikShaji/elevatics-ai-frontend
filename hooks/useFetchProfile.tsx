
"use client"

import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"

async function fetchProfileFromDatabase() {
    const response = await fetch(`/api/profile`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    })

    if (!response.ok) {
        throw new Error("failed to fetch report")
    }

    return response.json()
}

export default function useFetchProfile() {

    return useQuery({ queryKey: ["profile"], queryFn: () => fetchProfileFromDatabase() })
}

