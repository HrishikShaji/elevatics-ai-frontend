"use client"

import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useState } from 'react';
import { getTranslation } from '@/i18n';
import IconSettings from './icon/icon-settings';
import SettingsSection from './SettingsSection';

export default function SettingsModal() {
    const [modal, setModal] = useState(false);
    const { t } = getTranslation();

    return (
        <>
            <li className="nav-item">
                <button type="button" onClick={() => setModal(true)} className="group">
                    <div className="flex items-center">
                        <IconSettings className="shrink-0 group-hover:!text-primary" />
                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('Settings')}</span>
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
                        <div className="flex items-center justify-center min-h-screen px-4">
                            <Transition.Child
                                as={Fragment}
                                enter="transition ease duration-500 transform"
                                enterFrom="opacity-0 translate-y-24"
                                enterTo="opacity-100 translate-y-0"
                                leave="transition ease duration-300 transform"
                                leaveFrom="opacity-100 translate-y-0"
                                leaveTo="opacity-0 -translate-y-24"
                            >
                                <Dialog.Panel className="panel border-0 p-5 rounded-3xl overflow-hidden  my-8 text-black dark:text-white-dark">
                                    <div className="flex flex-col gap-5 p-5 font-semibold text-lg dark:text-white">
                                        <h5 className='border-b-2 pl-5 py-2 bg-gray-200 rounded-3xl'>Settings</h5>
                                        <SettingsSection />
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
