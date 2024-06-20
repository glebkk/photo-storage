import React, { useState, useRef, useEffect } from 'react';
import { IoEllipsisVerticalSharp } from 'react-icons/io5';

interface CardMenuProps {
    onEdit?: () => void;
    onDelete?: () => void;
    onShare?: () => void;
}

export const CardMenu: React.FC<CardMenuProps> = () => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('click', handleOutsideClick);

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);

    return (
        <div className="absolute z-50 top-0 right-0">
            <button
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-700 cursor-pointer"
                onClick={(e) => {
                    e.stopPropagation()
                    toggleMenu()
                }}
            >
                <IoEllipsisVerticalSharp size={20} />
            </button>
            {isOpen && (
                <div
                    ref={menuRef}
                    className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-10"
                >
                    <ul className="py-1">
                        <li
                            className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-700 cursor-pointer"
                        >
                            Edit
                        </li>
                        <li
                            className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-700 cursor-pointer"
                        >
                            Delete
                        </li>
                        <li
                            className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-700 cursor-pointer"
                        >
                            Share
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};