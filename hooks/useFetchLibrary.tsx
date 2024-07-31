
import { FETCH_LIBRARY_URL } from '@/lib/endpoints';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

const fetchLibrary = async ({ page, pageSize, reportType }: { page: number, pageSize: number, reportType: "QUICK" | "FULL" | "" }) => {
    const response = await fetch(`${FETCH_LIBRARY_URL}?page=${page}&pageSize=${pageSize}&reportType=${reportType}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
        throw new Error("Error fetching reports");
    }

    return response.json();
};

const useFetchLibrary = ({ page, pageSize, reportType }: { page: number, pageSize: number, reportType: "QUICK" | "FULL" | "" }) => {
    return useQuery({ queryKey: ['reports', page, pageSize, reportType], queryFn: () => fetchLibrary({ page, pageSize, reportType }) });

};

export default useFetchLibrary;
