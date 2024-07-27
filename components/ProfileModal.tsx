
"use client"

import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useState } from 'react';
import IconMenuChat from './icon/menu/icon-menu-chat';
import { getTranslation } from '@/i18n';
import IconSettings from './icon/icon-settings';
import IconUser from './icon/icon-user';
import { useAccount } from '@/contexts/AccountContext';
import Image from 'next/image';

export default function ProfileModal() {
    const [modal, setModal] = useState(false);
    const { profile } = useAccount()
    const { t } = getTranslation();
    console.log(profile)
    return (
        <>
            <li className="nav-item">
                <button type="button" onClick={() => setModal(true)} className="group">
                    <div className="flex items-center">
                        <IconUser className="shrink-0 group-hover:!text-primary" />
                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('Profile')}</span>
                    </div>
                </button>
            </li>
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
                                <Dialog.Panel className="panel border-0 p-5 rounded-3xl overflow-hidden  my-8 text-black dark:text-white-dark">
                                    <div className="flex flex-col gap-5 p-5 font-semibold text-lg dark:text-white">
                                        <h5 className='border-b-2 pl-5 py-2 bg-gray-200 rounded-3xl'>Profile</h5>
                                        {profile ?

                                            <div className='flex items-center gap-5 bg-gray-200 pr-10 rounded-3xl'>
                                                {profile.image ?
                                                    <div className='h-[200px] w-[200px] flex-shrink-0 overflow-hidden rounded-l-3xl'>
                                                        <Image src={profile.image} alt="profile-img" height={1000} width={1000} className='h-[200px] w-[200px] rounded-l-3xl hover:scale-110 duration-500' />
                                                    </div>
                                                    : null}
                                                <table>
                                                    <tbody><tr className=''><td className='border-b-2 !text-left !p-1 border-white'>Name</td><td className='!pl-10 border-b-2 border-white !py-2'>{profile.name}</td></tr>
                                                        <tr className='border-b-2  border-black'><td className='border-b-2 !text-left !p-1 border-white'>Email</td><td className='!pl-10 border-b-2 border-white !py-2'>{profile.email}</td></tr>
                                                        <tr className='border-b-2  border-black'><td className='border-b-2 !text-left !p-1 border-white'>Current Plan</td><td className='!pl-10 border-b-2 border-white !py-2'>{profile.plan}</td></tr>
                                                        <tr className='border-b-2 border-black'><td className='border-b-2 !text-left !p-1 '>Quieries Left</td><td className='!pl-10 border-b-2  !py-2'>{profile.queries}</td></tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            : null}
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
