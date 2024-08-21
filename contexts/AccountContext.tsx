

"use client";
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import useFetchProfile from "@/hooks/useFetchProfile";
import { Fingerprint, User } from "@prisma/client";
import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect
} from "react";

interface AccountData {
    profile: User | null;
    updateQueryLimit: () => void;
    incrementNonLoggedInUsage: () => void;
    currentFingerPrint: Fingerprint | null
}
const AccountContext = createContext<AccountData | undefined>(undefined);

export const useAccount = () => {
    const context = useContext(AccountContext);
    if (!context) {
        throw new Error("useAccount must be used within a AccountProvider");
    }
    return context;
};

type AccountProviderProps = {
    children: ReactNode;
};


export const AccountProvider = ({ children }: AccountProviderProps) => {
    const [profile, setProfile] = useState<User | null>(null);
    const { data, isSuccess } = useFetchProfile()
    const [fpHash, setFpHash] = useState('');
    const [currentFingerPrint, setCurrentFingerPrint] = useState<Fingerprint | null>(null)

    useEffect(() => {
        const setFp = async () => {
            const fp = await FingerprintJS.load();

            const { visitorId } = await fp.get();

            setFpHash(visitorId);
            const response = await fetch(`/api/fingerprint/${visitorId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            })
            const result = await response.json()
            setCurrentFingerPrint(result.fingerPrint)
            console.log("response is ", result)
        };

        setFp();
    }, []);
    useEffect(() => {
        if (isSuccess) {
            setProfile(data.profile)
        }
    }, [isSuccess, data])

    async function incrementNonLoggedInUsage() {
        if (!currentFingerPrint) return;
        try {

            const response = await fetch(`/api/fingerprint/${currentFingerPrint.browserId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            })
            const result = await response.json();
            console.log("after updation", result)
            setCurrentFingerPrint(result.fingerPrint)
        } catch (error) {
            console.log(error)
        }
    }

    async function updateQueryLimit() {
        if (!profile) return;

        try {

            const response = await fetch(`/api/query/${profile.id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            })
            const result = await response.json();
            console.log("after query updation", result)
            setProfile(result.profile)
        } catch (error) {
            console.log(error)
        }
    }

    const accountData = {
        profile,
        incrementNonLoggedInUsage,
        currentFingerPrint,
        updateQueryLimit
    };



    return (
        <AccountContext.Provider value={accountData}>
            {children}
        </AccountContext.Provider>
    );
};
