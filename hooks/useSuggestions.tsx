
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



export default function useSuggestions(input: string) {
    const debouncedValue = useDebounce(input, 1000);
    const queryClient = useQueryClient();

    const { data, isLoading, isSuccess, isFetching } = useQuery({
        queryKey: ["suggestions", debouncedValue],
        queryFn: () => fetchSuggestions(debouncedValue),
        enabled: !!debouncedValue,
    }
    );

    const { mutate } = useMutation({
        mutationFn: (prompt: string) => fetchSuggestions(prompt),
        onSuccess: (data) => {
            queryClient.setQueryData(['suggestions', debouncedValue], data);
        }
    }
    );

    return {
        isLoading: isLoading || isFetching,
        isSuccess,
        data: data ? data.recommendations : [],
        mutate,
        input,
    };
}
