
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

interface InvestorDataResponse {
    // Define the structure of your InvestorDataResponse here
}


async function fetchInvestor(formData: FormData) {
    const response = await fetch("https://nithin1905-investor.hf.space/investor", {
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
