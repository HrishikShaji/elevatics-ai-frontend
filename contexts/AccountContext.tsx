

"use client";

import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    SetStateAction,
    Dispatch,
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
    const accountData = {
        profile
    };

    const { status, data } = useSession()


    return (
        <AccountContext.Provider value={accountData}>
            {children}
        </AccountContext.Provider>
    );
};
