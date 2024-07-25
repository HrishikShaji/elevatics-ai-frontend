"use client"

import useFetchSavedReport from "@/hooks/useFetchSavedReport"

export default function SavedReport() {
    const { data } = useFetchSavedReport()
    console.log(data)

    return <div></div>
}
