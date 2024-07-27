import { useSettings } from "@/contexts/SettingsContext";
import { DataFormatType, OutputFormatType } from "@/types/types";
import { Tab } from "@headlessui/react";
import { Fragment } from "react";
import CustomDropdown from "./CustomDropdown";
import { subtle } from "crypto";
import { useSelector } from "react-redux";
import { IRootState } from "@/store";
import { useDispatch } from "react-redux";
import { toggleAnimation, toggleTheme } from "@/store/themeConfigSlice";

export default function SettingsSection() {
    const { setReportOptions, setAgentModel, setTopicsLimit, reportOptions, topicsLimit } = useSettings()

    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const dispatch = useDispatch();

    const dataFormatOptions: { title: string; value: DataFormatType }[] = [{ title: 'No Presets', value: "No presets" }, { title: 'Structured Data', value: "Structured data" }, { title: 'Quantitative Data', value: "Quantitative data" }]
    const outputFormatOptions: { title: string; value: OutputFormatType }[] = [{ title: 'Chat', value: "chat" }, { title: 'Report', value: "report" }, { title: 'Report Table', value: "report_table" }]
    const topicsOptions: { title: string; value: number }[] = [{ title: "1", value: 1 }, { title: "2", value: 2 }, { title: "3", value: 3 }, { title: '4', value: 4 }, { title: "5", value: 5 }]
    const subTopicsOptions: { title: string; value: number }[] = [{ title: "1", value: 1 }, { title: "2", value: 2 }, { title: "3", value: 3 }, { title: '4', value: 4 }, { title: "5", value: 5 }]
    const animationOptions: { title: string; value: string }[] = [{ title: "Fade", value: "animate__fadeIn" },
    { title: "Fade Down", value: "animate__fadeInDown" },
    { title: "Fade Up", value: "animate__fadeInUp" },
    { title: "Fade Left", value: "animate__fadeInLeft" }, { title: "Fade Right", value: "animate__fadeInRight" },
    { title: "Slide Up", value: "animate__slideInUp" }, { title: "Slide Down", value: "animate__slideInDown" }, { title: "Slide Left", value: "animate__slideInLeft" },
    { title: "Slide Right", value: "animate__fadeInRight" }, { title: "Zoom In", value: "animate__zoomIn" }]
    const themeOptions: { title: string, value: string }[] = [{ title: "Light", value: "light" }, { title: "Dark", value: "dark" }, { title: "System", value: "system" }]


    function animationChange(value: string | number) {
        dispatch(toggleAnimation(value as string))
    }

    function themeChange(value: string | number) {
        dispatch(toggleTheme(value))
    }

    function outputFormatChange(value: string | number) {
        setReportOptions((prev) => ({
            ...prev,
            outputFormat: value as OutputFormatType
        }))
    }

    function topicsChange(value: string | number) {
        setTopicsLimit(prev => ({
            ...prev,
            topics: value as number
        }))
    }
    function subTopicsChange(value: string | number) {
        setTopicsLimit(prev => ({
            ...prev,
            subTopics: value as number
        }))
    }

    function dataFormatChange(value: string | number) {
        setReportOptions((prev) => ({
            ...prev,
            dataFormat: value as DataFormatType
        }))
    }

    return (

        <div className="mb-5 flex bg-gray-200 rounded-3xl p-5  items-start w-[700px] h-[300px] flex-col sm:flex-row">
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
                        <div className="active flex-col items-start pt-4 gap-4 flex">
                            <CustomDropdown label="Theme" options={themeOptions} value={themeConfig.theme} onChange={themeChange} />
                            <CustomDropdown label="Animation" options={animationOptions} value={themeConfig.animation} onChange={animationChange} />
                        </div>
                    </Tab.Panel>
                    <Tab.Panel>
                        <div className="flex items-start pt-4 flex-col gap-4">
                            <CustomDropdown label="Data Format" options={dataFormatOptions} value={reportOptions.dataFormat} onChange={dataFormatChange} />
                            <CustomDropdown label="Output Format" options={outputFormatOptions} value={reportOptions.outputFormat} onChange={outputFormatChange} />
                            <CustomDropdown label="Topics Limit" options={topicsOptions} value={topicsLimit.topics} onChange={topicsChange} />
                            <CustomDropdown label="SubTopics Limit" options={subTopicsOptions} value={topicsLimit.subTopics} onChange={subTopicsChange} />
                        </div>
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
        </div>
    )
}
