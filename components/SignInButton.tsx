"use client"
import { Dialog, Transition } from "@headlessui/react"
import { Fragment, useState } from "react"
import { signIn, signOut, useSession } from "next-auth/react"
import { sign } from "crypto"

export default function SignInButton() {
    const [modal, setModal] = useState(false)
    const { status, data } = useSession()

    return (
        <>
            {status === "authenticated" ? null :
                <button type="button" onClick={() => setModal(true)} className="absolute top-0 right-0">
                    Login
                </button>}
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
                        <div className="flex items-start justify-center  px-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="panel border-0 py-1 px-4 rounded-lg overflow-hidden w-full max-w-sm my-8 text-black dark:text-white-dark">
                                    <div className="flex items-center justify-between p-5 font-semibold text-lg dark:text-white">
                                        <h5>Login</h5>
                                        <button type="button" onClick={() => setModal(false)} className="text-white-dark hover:text-dark">
                                            <svg>...</svg>
                                        </button>
                                    </div>

                                    <div className="p-5">
                                        <form>
                                            <div className="relative mb-4">
                                                <span className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 dark:text-white-dark">
                                                    <svg>...</svg>
                                                </span>
                                                <input disabled type="email" placeholder="Email" className="form-input ltr:pl-10 rtl:pr-10" id="login_email" />
                                            </div>
                                            <div className="relative mb-4">
                                                <span className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 dark:text-white-dark">
                                                    <svg>...</svg>
                                                </span>
                                                <input disabled type="password" placeholder="Password" className="form-input ltr:pl-10 rtl:pr-10" id="login_password" />
                                            </div>
                                            <button type="button" className="btn btn-primary w-full">
                                                Login
                                            </button>
                                        </form>
                                    </div>
                                    <div className="w-full bg-green-500 h-10"></div>
                                    <div className="my-4 text-center text-xs text-white-dark dark:text-white-dark/70">OR</div>
                                    <div className="flex  justify-center gap-3 mb-5">
                                        <button onClick={() => signIn("google", { callbackUrl: "/" })} type="button" className="btn btn-outline-primary flex gap-1">
                                            <svg>...</svg>

                                            <span>Google</span>
                                        </button>
                                        <button onClick={() => signIn("github", { callbackUrl: "/" })} type="button" className="btn btn-outline-danger flex gap-1">
                                            <svg>...</svg>
                                            <span>Github</span>
                                        </button>
                                    </div>
                                    <div className="p-5 border-t border-[#ebe9f1] dark:border-white/10">
                                        <p className="text-sm text-center text-white-dark dark:text-white-dark/70">
                                            Looking to
                                            <button type="button" className="text-[#515365] hover:underline dark:text-white-dark ltr:ml-1 rtl:mr-1">
                                                create an account?
                                            </button>
                                        </p>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}
