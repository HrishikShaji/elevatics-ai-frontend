
"use client"

import { FETCH_PROFILE_URL } from "@/lib/endpoints"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"

async function fetchProfileFromDatabase() {
    const response = await fetch(FETCH_PROFILE_URL, {
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

