import { ThemeSwitcher } from "./ThemeSwitcher"

type Props = {}

export const Sidebar = (props: Props) => {
    return (
        <aside className="absolute w-full -translate-x-full sm:-translate-x-0 sm:w-64 sm:sticky h-screen transition-transform" aria-label="Sidebar">
            <div className="h-full px-3 py-4 overflow-y-auto bg-white dark:bg-zinc-800">
                <div className="flex flex-col gap-2 w-full">
                    <ThemeSwitcher className="self-start" />
                    <a className="p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-sky-700">Главная</a>
                    <a className="p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-sky-700">Галерея</a>
                    <a className="p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-sky-700">Выйти</a>
                </div>
            </div>
        </aside>
    )
}