
import { ChangeEvent, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useDebounce from './useDebounce';
import { HFSPACE_TOKEN, SUGGESTIONS_URL } from '@/lib/endpoints';

async function fetchSuggestions(prompt: string) {
    const headers = {
        Authorization: HFSPACE_TOKEN,
        "Content-Type": "application/json",
    };
    const response = await fetch(
        SUGGESTIONS_URL,
        {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
                user_input: prompt,
                num_recommendations: 6,
            }),
        },
    );

    if (!response.ok) {
        throw new Error("Error fetching recommendations");
    }

    return response.json();
}
export default function useSuggestions() {
    const [input, setInput] = useState('');
    const debouncedValue = useDebounce(input, 1000);
    const queryClient = useQueryClient();

    const { data, isLoading, isSuccess, isFetching } = useQuery({
        queryKey: ["suggestions", debouncedValue],
        queryFn: () => fetchSuggestions(debouncedValue),
        enabled: !!debouncedValue, // Only run the query if debouncedValue is not empty
    }
    );

    const mutation = useMutation({
        mutationFn: (prompt: string) => fetchSuggestions(prompt),
        onSuccess: (data) => {
            queryClient.setQueryData(['suggestions', debouncedValue], data);
        }
    }
    );

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        setInput(e.target.value);
    }

    function handleRecommendation(prompt: string) {
        setInput(prompt);
        mutation.mutate(prompt);
    }

    return {
        isLoading: isLoading || isFetching,
        isSuccess,
        data: data ? data.recommendations : [],
        handleRecommendation,
        handleChange,
        input,
    };
}
