import { Tab } from "@headlessui/react";
import { Fragment } from "react";

export default function SettingsSection() {
    return (

        <div className="mb-5 flex bg-gray-200 rounded-3xl p-5 items-start h-[300px] flex-col sm:flex-row">
            <Tab.Group>
                <div className=" mr-10 mb-5 sm:mb-0">
                    <Tab.List className=" w-32 text-left font-semibold">
                        <Tab as={Fragment} >
                            {({ selected }) => (
                                <button
                                    className={`${selected ? 'text-secondary !outline-none before:!h-[80%]' : ''}
                                                    !text-left relative -mb-[1px] block w-full border-white-light pl-0 pr-3.5 py-4 before:absolute before:bottom-0 before:top-0 before:m-auto before:inline-block before:h-0 before:w-[1px] before:bg-secondary before:transition-all before:duration-700 hover:text-secondary hover:before:h-[80%] ltr:border-r ltr:before:-right-[1px] rtl:border-l rtl:before:-left-[1px] dark:border-[#191e3a]`}
                                >
                                    Appearance
                                </button>
                            )}
                        </Tab>
                        <Tab as={Fragment}>
                            {({ selected }) => (
                                <button
                                    className={`${selected ? 'text-secondary !outline-none before:!h-[80%]' : ''}
                                                    relative !text-left -mb-[1px] block w-full border-white-light pl-0 p-3.5 py-4 before:absolute before:bottom-0 before:top-0 before:m-auto before:inline-block before:h-0 before:w-[1px] before:bg-secondary before:transition-all before:duration-700 hover:text-secondary hover:before:h-[80%] ltr:border-r ltr:before:-right-[1px] rtl:border-l rtl:before:-left-[1px] dark:border-[#191e3a]`}
                                >
                                    Options
                                </button>
                            )}
                        </Tab>
                    </Tab.List>
                </div>
                <Tab.Panels>
                    <Tab.Panel>
                        <div className="active">
                            <h4 className="mb-4 text-2xl font-semibold">We move your world!</h4>
                            <p className="mb-4">
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                                nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            </p>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                                nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            </p>
                        </div>
                    </Tab.Panel>
                    <Tab.Panel>
                        <div className="flex items-start">
                            <div className="h-20 w-20 flex-none ltr:mr-4 rtl:ml-4">
                                <img src="/assets/images/profile-34.jpeg" alt="img" className="m-0 h-20 w-20 rounded-full object-cover ring-2 ring-[#ebedf2] dark:ring-white-dark" />
                            </div>
                            <div className="flex-auto">
                                <h5 className="mb-4 text-xl font-medium">Media heading</h5>
                                <p className="text-white-dark">
                                    Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus viverra
                                    turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
                                </p>
                            </div>
                        </div>
                    </Tab.Panel>
                    <Tab.Panel>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p>
                    </Tab.Panel>
                    <Tab.Panel>
                        <div className="rounded-br-md rounded-tr-md border border-l-2 border-white-light !border-l-primary bg-white p-5 text-black shadow-md ltr:pl-3.5 rtl:pr-3.5 dark:border-[#060818] dark:bg-[#060818]">
                            <div className="flex items-start">
                                <p className="m-0 text-sm not-italic text-[#515365] dark:text-white-dark">
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                                    nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.
                                </p>
                            </div>
                        </div>
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
        </div>
    )
}
