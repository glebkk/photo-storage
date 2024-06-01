import { Link } from "react-router-dom"

export const Sidebar = () => {
    return (
        <aside className="absolute w-full -translate-x-full sm:-translate-x-0 sm:w-64 sm:sticky top-0 left-0 h-screen transition-transform" aria-label="Sidebar">
            <div className="h-full px-3 py-4 overflow-y-auto bg-white dark:bg-zinc-800">
                <div className="flex flex-col gap-2 w-full">
                    <Link to={"/"} className="p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-900">Фотографии</Link>
                    <a className="p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-900">Галерея</a>
                    <a className="p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-900">Выйти</a>
                </div>
            </div>
        </aside>
    )
}