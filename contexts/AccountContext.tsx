

"use client";
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import useFetchProfile from "@/hooks/useFetchProfile";
import { User } from "@prisma/client";
import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect
} from "react";

interface AccountData {
    profile: User | null;
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

    useEffect(() => {
        const setFp = async () => {
            const fp = await FingerprintJS.load();

            const { visitorId } = await fp.get();

            setFpHash(visitorId);
        };

        setFp();
    }, []);
    console.log("this is fingerprint", fpHash)
    useEffect(() => {
        if (isSuccess) {
            setProfile(data.profile)
        }
    }, [isSuccess, data])
    const accountData = {
        profile
    };



    return (
        <AccountContext.Provider value={accountData}>
            {children}
        </AccountContext.Provider>
    );
};
