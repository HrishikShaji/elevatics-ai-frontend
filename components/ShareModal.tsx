

"use client"

import { FaRegCopy } from "react-icons/fa"
import { Dialog, Transition } from '@headlessui/react';
import React, { ChangeEvent, Fragment, useEffect, useRef, useState } from 'react';
import IconMenuChat from './icon/menu/icon-menu-chat';
import { getTranslation } from '@/i18n';
import IconSettings from './icon/icon-settings';
import IconUser from './icon/icon-user';
import { ReportType } from '@prisma/client';

interface ShareModalProps {
    reportId: string;
    type: ReportType
}

export default function ShareModal({ reportId, type }: ShareModalProps) {
    const [modal, setModal] = useState(false);
    const { t } = getTranslation();
    const [inputValue, setInputValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {

        setInputValue(`${process.env.NEXT_PUBLIC_URL}/saved/${reportId}`)
    }, [reportId])

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const copyToClipboard = () => {
        if (inputRef.current) {

            inputRef.current.select();
            inputRef.current.setSelectionRange(0, 99999);

            document.execCommand('copy');

            alert('Copied the text: ' + inputRef.current.value);
        }
    };
    return (
        <>
            <button type="button" onClick={() => setModal(true)} className="group">
                Share
            </button>
            <Transition appear show={modal} as={Fragment}>
                <Dialog as="div" open={modal} onClose={() => setModal(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0" />
                    </Transition.Child>
                    <div id="login_modal" className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
                        <div className="flex items-center min-h-screen justify-center  px-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="panel border-0 py-1 px-4 rounded-lg overflow-hidden   my-8 text-black dark:text-white-dark">
                                    <div className="flex flex-col gap-10 p-5 font-semibold text-lg dark:text-white">
                                        <h5>Share</h5>
                                        <div className="flex flex-col gap-2">
                                            <h1 className="pb-2 font-semibold border-b-[1px] border-gray-300 ">
                                                Share Link
                                            </h1>
                                            <div className=" flex gap-5 items-center  relative">
                                                <input
                                                    className="p-2 w-[50vw] pr-10 rounded-md bg-gray-100"
                                                    type="text"
                                                    value={inputValue}
                                                    onChange={handleInputChange}
                                                    ref={inputRef}
                                                />
                                                <button className=" absolute right-2  hover:text-gray-700 z-10" onClick={copyToClipboard}><FaRegCopy size={20} /></button>
                                            </div>
                                        </div>
                                    </div>

                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}
