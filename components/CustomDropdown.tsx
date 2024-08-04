import Dropdown from "./dropdown";
import IconCaretDown from "./icon/icon-caret-down";

interface CustomDropdownProps {
    label: string | number;
    value: string | number;
    onChange: (value: string | number) => void;
    options: { value: string | number; title: string }[]
}

export default function CustomDropdown({ label, value, options, onChange }: CustomDropdownProps) {
    function getCurrentTitle() {
        const selectedItem = options.find(item => item.value === value)

        return selectedItem?.title ? selectedItem.title : ""
    }
    return (

        <div className=" flex gap-5 items-center">
            {label ?
                <h5 className="text-sm min-w-[100px]">{label}</h5>
                : null}
            <Dropdown
                offset={[0, 8]}
                placement="bottom-end"
                btnClassName=" min-w-[150px] flex justify-between p-2 border-gray-300 border-[1px] rounded-md   "
                button={
                    <>
                        <h1>{getCurrentTitle()}</h1>
                        <span>
                            <IconCaretDown className="inline-block ltr:ml-1 rtl:mr-1 " />
                        </span>
                    </>
                }
            >
                <ul className="!min-w-[150px] !bg-white !shadow-gray-400 !shadow-3xl divide-y-2 !rounded-2xl !overflow-hidden !py-0 ">
                    {options.map((item, i) => (

                        <li key={i}>
                            <button type="button" className="!pl-4 hover:bg-gray-200 w-full text-left text-sm !py-1" onClick={() => onChange(item.value)}>{item.title}</button>
                        </li>
                    ))}
                </ul>
            </Dropdown>
        </div>
    )
}
