import Dropdown from "./dropdown";
import IconCaretDown from "./icon/icon-caret-down";

interface CustomDropdownProps {
    label: string;
    value: string;
    onChange: (value: string | number) => void;
    options: { value: string | number; title: string }[]
}

export default function CustomDropdown({ label, value, options, onChange }: CustomDropdownProps) {
    return (

        <div className="dropdown">
            <h1>{label}</h1>
            <Dropdown
                offset={[0, 8]}
                placement="bottom-end"
                btnClassName="btn btn-outline-dark btn-sm dropdown-toggle "
                button={
                    <>
                        <h1>{value}</h1>
                        <span>
                            <IconCaretDown className="inline-block ltr:ml-1 rtl:mr-1" />
                        </span>
                    </>
                }
            >
                <ul className="!min-w-[300px] !shadow-gray-300 !shadow-3xl  !rounded-xl ">
                    {options.map((item, i) => (

                        <li key={i}>
                            <button type="button" onClick={() => onChange(item.value)}>{item.title}</button>
                        </li>
                    ))}
                </ul>
            </Dropdown>
        </div>
    )
}
