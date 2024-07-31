
import { DELETE_REPORT_URL } from '@/lib/endpoints';
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';

async function deleteReport(id: string) {
    const response = await fetch(DELETE_REPORT_URL, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
    });

    if (!response.ok) {
        throw new Error('Failed to delete report');
    }
}

const useDeleteLibraryItem = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation({ mutationFn: deleteReport, mutationKey: ["reports"], onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reports"] }) });

    return mutation;
};

export default useDeleteLibraryItem;
