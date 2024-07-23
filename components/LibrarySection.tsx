"use client"

import useFetchLibrary from "@/hooks/useFetchLibrary"
import LibraryTable from "./LibraryTable"

export default function LibrarySection() {
    const { data, isLoading } = useFetchLibrary({ page: 1, pageSize: 20, reportType: "" })
    console.log(data)
    return (<> {isLoading ? "loading..." : <LibraryTable rowData={data.reports} />}</>)
}
