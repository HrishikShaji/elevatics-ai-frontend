import { useState, useEffect, useRef } from "react";
import Dropdown from "./dropdown";
import IconCaretDown from "./icon/icon-caret-down";

interface CustomDropdownProps {
    label: string | number;
    value: string | number;
    onChange: (value: string | number) => void;
    options: { value: string | number; title: string }[]
}

export default function CustomDropdown({ label, value, options, onChange }: CustomDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    function getCurrentTitle() {
        const selectedItem = options.find(item => item.value === value);
        return selectedItem?.title ? selectedItem.title : "";
    }

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div ref={dropdownRef} className="flex relative gap-5 items-center">
            {label ? <h5 className="text-sm min-w-[100px]">{label}</h5> : null}
            <div className="relative">
                <button
                    onClick={() => setIsOpen(prev => !prev)}
                    className="relative z-1 min-w-[150px] flex justify-between p-2 border-gray-300 border-[1px] rounded-md"
                >
                    <h1>{getCurrentTitle()}</h1>
                    <span style={{ rotate: isOpen ? "180deg" : "0deg" }}>
                        <IconCaretDown className="inline-block" />
                    </span>
                </button>
                {isOpen ? (
                    <ul className="!min-w-[150px] absolute top-12 z-10 !bg-white !shadow-gray-400 !shadow-3xl divide-y-2 !rounded-2xl !overflow-hidden !py-0">
                        {options.map((item, i) => (
                            <li key={i}>
                                <button
                                    type="button"
                                    className="!pl-4 hover:bg-gray-200 w-full text-left text-sm !py-1"
                                    onClick={() => { setIsOpen(false); onChange(item.value); }}
                                >
                                    {item.title}
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : null}
            </div>
        </div>
    );
}
