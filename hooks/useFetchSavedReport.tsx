"use client"

import { FETCH_SAVED_REPORT_URL } from "@/lib/endpoints"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"

async function fetchReportFromDatabase(id: string) {
    const response = await fetch(`${FETCH_SAVED_REPORT_URL}/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    })

    if (!response.ok) {
        throw new Error("failed to fetch report")
    }

    const result = await response.json()
    return result.report
}

export default function useFetchSavedReport() {
    const { id } = useParams()

    return useQuery({ queryKey: ["reports", id], queryFn: () => fetchReportFromDatabase(id as string) })
}

