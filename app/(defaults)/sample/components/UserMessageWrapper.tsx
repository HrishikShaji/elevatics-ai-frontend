import { useAccount } from "@/contexts/AccountContext"
import Image from "next/image";
import { ReactNode } from "react";

interface UserMessageWrapperProps {
    children: ReactNode;
}

export default function UserMessageWrapper({ children }: UserMessageWrapperProps) {
    const { profile } = useAccount()
    return (
        <div className='w-full  flex justify-end '>
            <div className='  flex items-center pl-2 gap-2 p-1'>
                <h1 className='bg-gray-200 py-2 px-4 rounded-3xl '>{children}</h1>
                <div className='h-8 w-8 rounded-full bg-blue-500 overflow-hidden'>
                    {profile?.image ? <Image src={profile.image} alt="profile" height={1000} width={1000} className="h-full w-full object-cover" /> : null}
                </div>
            </div>
        </div>
    )
}
