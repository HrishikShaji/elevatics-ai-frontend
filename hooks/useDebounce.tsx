
import { useEffect, useState } from "react";

export default function useDebounce(value: string, delay = 500) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const id = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(id);
        };
    }, [delay, value]);
    return debouncedValue;
}
