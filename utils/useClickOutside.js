import { useEffect, useState } from "react";

export default function useClickOutside(ref, func) {
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        if (!enabled) return;

        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                func()
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, func, enabled]);

    return {setEnabled};
}