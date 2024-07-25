

"use client";

import useFetchProfile from "@/hooks/useFetchProfile";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    SetStateAction,
    Dispatch,
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
