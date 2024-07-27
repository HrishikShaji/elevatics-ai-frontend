import Dropdown from "./dropdown";
import IconCaretDown from "./icon/icon-caret-down";

interface CustomDropdownProps {
    label: string | number;
    value: string | number;
    onChange: (value: string | number) => void;
    options: { value: string | number; title: string }[]
}

export default function CustomDropdown({ label, value, options, onChange }: CustomDropdownProps) {
    return (

        <div className="dropdown flex gap-5 items-center">
            <h5 className="text-sm min-w-[100px]">{label}</h5>
            <Dropdown
                offset={[0, 8]}
                placement="bottom-start"
                btnClassName="btn min-w-[150px] flex justify-between btn-outline-dark rounded-2xl btn-sm dropdown-toggle "
                button={
                    <>
                        <h1>{value}</h1>
                        <span>
                            <IconCaretDown className="inline-block ltr:ml-1 rtl:mr-1 " />
                        </span>
                    </>
                }
            >
                <ul className="!min-w-[150px] !shadow-gray-400 !shadow-3xl divide-y-2 !rounded-2xl !overflow-hidden !py-0 ">
                    {options.map((item, i) => (

                        <li key={i}>
                            <button type="button" className="!pl-4  text-sm !py-1" onClick={() => onChange(item.value)}>{item.title}</button>
                        </li>
                    ))}
                </ul>
            </Dropdown>
        </div>
    )
}
