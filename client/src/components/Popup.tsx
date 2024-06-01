import { ReactNode, useEffect, useRef, useState } from "react";

type Props = {
    rendererElement: ReactNode
    children: ReactNode
}

export const Dropdown = ({ rendererElement, children }: Props) => {
    const [isOpen, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => setOpen(!isOpen);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside, true);

        return () => {
            document.removeEventListener("click", handleClickOutside, true);
        };
    }, []);

    return (
        <div className='relative' ref={dropdownRef}>
            <div className='relative' onClick={toggleDropdown}>
                {rendererElement}
            </div>
            {
                isOpen &&
                <div className="rounded-lg bg-gray-300 p-2 absolute z-50 right-0 border-2 border-gray-400 dark:border-zinc-700 dark:bg-zinc-900 min-w-32">
                    {children}
                </div>
            }
        </div>
    )
}
