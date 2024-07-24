

"use client";

import { InvestorDataResponse } from "@/types/types";
import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    SetStateAction,
    Dispatch,
} from "react";

interface InvestorData {
    prompt: string;
    fileName: string;
    file: File | null;
    setFile: Dispatch<SetStateAction<File | null>>;
    setFileName: Dispatch<SetStateAction<string>>;
    setPrompt: Dispatch<SetStateAction<string>>;
    setData: Dispatch<SetStateAction<InvestorDataResponse | null>>;
    data: InvestorDataResponse | null;
}
const InvestorContext = createContext<InvestorData | undefined>(undefined);

export const useInvestor = () => {
    const context = useContext(InvestorContext);
    if (!context) {
        throw new Error("useInvestor must be used within a InvestorProvider");
    }
    return context;
};

type InvestorProviderProps = {
    children: ReactNode;
};

export const InvestorProvider = ({ children }: InvestorProviderProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [prompt, setPrompt] = useState("");
    const [fileName, setFileName] = useState("")
    const [data, setData] = useState<InvestorDataResponse | null>(null)
    const investorData = {
        prompt,
        setPrompt,
        data,
        setData,
        fileName,
        setFileName,
        file,
        setFile
    };

    return (
        <InvestorContext.Provider value={investorData}>
            {children}
        </InvestorContext.Provider>
    );
};
