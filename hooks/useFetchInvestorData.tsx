import { INVESTOR_REPORT_URL } from '@/lib/endpoints';
import { useMutation } from '@tanstack/react-query';



async function fetchInvestor(formData: FormData) {
    const response = await fetch(INVESTOR_REPORT_URL, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        throw new Error("Network response was not ok");
    }

    return response.json();
}

const useFetchInvestorData = () => {

    return useMutation(
        {
            mutationFn: fetchInvestor,
            mutationKey: ["investor"],
        });

};

export default useFetchInvestorData;
