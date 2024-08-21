

import { Dialog, Transition } from "@headlessui/react"
import { Dispatch, Fragment, SetStateAction, useState } from "react"
import { signIn, signOut, useSession } from "next-auth/react"
import { sign } from "crypto"

interface PlanModalProps {
    modal: boolean;
    setModal: Dispatch<SetStateAction<boolean>>
}

export default function PlanModal({ modal, setModal }: PlanModalProps) {

    return (
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
                    <div className="flex items-center h-screen justify-center  px-4">
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
                                    <h5 className='border-b-2 pl-5 py-2 bg-gray-200 rounded-3xl'>Upgrade Plan</h5>
                                    <div className="flex flex-col w-[400px] bg-gray-200 rounded-3xl p-5 justify-center gap-3 mb-5">
                                        <div className="text-xl font=semibold">You exhausted your limit.</div>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}
