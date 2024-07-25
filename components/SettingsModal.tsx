"use client"

import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useState } from 'react';
import IconMenuChat from './icon/menu/icon-menu-chat';
import { getTranslation } from '@/i18n';
import IconSettings from './icon/icon-settings';
import Dropdown from './dropdown';
import IconCaretDown from './icon/icon-caret-down';
import { useSettings } from '@/contexts/SettingsContext';
import { DataFormatType, OutputFormatType } from '@/types/types';
import SettingsSection from './SettingsSection';

export default function SettingsModal() {
    const [modal, setModal] = useState(false);
    const { setReportOptions, setAgentModel, setTopicsLimit, reportOptions } = useSettings()
    const { t } = getTranslation();

    const dataFormatOptions: { title: string; value: DataFormatType }[] = [{ title: 'No Presets', value: "No presets" }, { title: 'Structured Data', value: "Structured data" }, { title: 'Quantitative Data', value: "Quantitative data" }]
    const outputFormatOptions: { title: string; value: OutputFormatType }[] = [{ title: 'Chat', value: "chat" }, { title: 'Report', value: "report" }, { title: 'Report Table', value: "report_table" }]

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
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="panel border-0 py-1 px-4 rounded-lg overflow-hidden w-full max-w-[60vw] my-8 text-black dark:text-white-dark">
                                    <div className="flex flex-col   p-5 font-semibold text-lg dark:text-white">
                                        <h5>Settings</h5>
                                        <SettingsSection />
                                        <div>
                                            <div className="dropdown">
                                                <Dropdown
                                                    offset={[0, 8]}
                                                    placement="bottom-end"
                                                    btnClassName="btn btn-outline-dark btn-sm dropdown-toggle "
                                                    button={
                                                        <>
                                                            <h1>{reportOptions.dataFormat}</h1>
                                                            <span>
                                                                <IconCaretDown className="inline-block ltr:ml-1 rtl:mr-1" />
                                                            </span>
                                                        </>
                                                    }
                                                >
                                                    <ul className="!min-w-[300px] !shadow-gray-300 !shadow-3xl  !rounded-xl ">
                                                        {dataFormatOptions.map((item, i) => (

                                                            <li key={i}>
                                                                <button type="button" onClick={() => setReportOptions((prev) => ({ ...prev, dataFormat: item.value }))}>{item.title}</button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </Dropdown>
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
