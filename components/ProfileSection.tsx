"use client"
import { TiDeleteOutline } from "react-icons/ti";
import { MdEdit } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import { useAccount } from "@/contexts/AccountContext"
import Image from "next/image"

export default function ProfileSection() {
    const { profile } = useAccount()
    if (!profile) return null;
    return <div className="p-5 h-screen w-full">
        <div className="w-full h-full shadow-lg rounded-md p-5 flex flex-col gap-5">
            <div className="pb-5 border-b-[1px] border-gray-200 w-full">
                <h1 className="text-4xl">Profile Settings</h1>
            </div>
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl ">Profile</h1>
                <h1>Update your personal details here.</h1>
            </div>
            <div className="flex gap-4 items-center">
                <div className="w-20 h-20 rounded-full overflow-hidden ">
                    <Image src={profile.image as string} alt="" className="h-full w-full object-cover" height={1000} width={1000} />

                </div>
                <button className="p-2 items-center rounded-md border-[1px] border-gray-200 flex gap-2">
                    <MdEdit /> Edit
                </button>
                <button className="p-2 items-center rounded-md border-[1px] border-gray-200 flex gap-2">
                    <AiOutlineDelete /> Delete
                </button>
            </div>
            <form className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2 ">
                    <label className="font-semibold">First name</label>
                    <input placeholder="john" className="border-[1px] border-gray-200 p-2 rounded-md w-[400px]" />
                </div>
                <div className="flex flex-col gap-2 ">
                    <label className="font-semibold">Last name</label>
                    <input placeholder="doe" className="border-[1px] border-gray-200 p-2 rounded-md w-[400px]" />
                </div>
                <div className="flex flex-col gap-2 ">
                    <label className="font-semibold">Registered Email</label>
                    <input placeholder="john@gmail.com" className="border-[1px] border-gray-200 p-2 rounded-md w-[400px]" />
                </div>
                <div className="flex flex-col gap-2 ">
                    <label className="font-semibold">Subscribed Plan</label>
                    <input placeholder="free" className="border-[1px] border-gray-200 p-2 rounded-md w-[400px]" />
                </div>
                <div className="flex flex-col gap-2 ">
                    <label className="font-semibold">What best describes you</label>
                    <input placeholder="cool" className="border-[1px] border-gray-200 p-2 rounded-md w-[400px]" />
                </div>
            </form>
            <div className="flex gap-4 ">
                <div className="flex gap-4 p-2 text-blue-400 items-center rounded-md border-[1px] border-blue-400">
                    Product Manaager  <TiDeleteOutline size={20} />
                </div>
                <div className="flex gap-4 p-2 text-blue-400 items-center rounded-md border-[1px] border-blue-400">
                    Developer  <TiDeleteOutline size={20} />
                </div>
                <div className="flex gap-4 p-2 text-blue-400 items-center rounded-md border-[1px] border-blue-400">
                    Student  <TiDeleteOutline size={20} />
                </div>
            </div>
            <div className="w-full flex justify-end">
                <div className="flex gap-4">
                    <button className="w-[100px] rounded-md border-[1px] border-gray-200 py-2">Cancel</button>
                    <button className="w-[100px] bg-gradient-to-b from-blue-500 to-purple-500 rounded-md text-white py-2">Save</button>
                </div>
            </div>
        </div>
    </div>
}
