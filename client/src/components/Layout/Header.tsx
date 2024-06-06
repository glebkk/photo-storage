import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { FaUserAlt } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { Link } from "react-router-dom";
import { StoreContext } from "../../main";
import { Dropdown } from "../Popup";
import { ThemeSwitcher } from "./ThemeSwitcher";


export const Header = observer(() => {
    const { store: { authStore: store } } = useContext(StoreContext)

    return (
        <header className="w-full px-4 py-3 flex gap-4 justify-between items-center h-16 rounded-b-lg bg-white dark:bg-zinc-800">
            
            <input className="w-full h-full" type="text" placeholder="Поиск" />
            <Dropdown
                rendererElement={
                    <div className="flex gap-2 items-center cursor-pointer">
                        <p>{store.user.login}</p>
                        <FaUserAlt size={16} />
                    </div>
                }
            >
                <div className="flex flex-col">
                    <ThemeSwitcher />
                    <Link to="/settings" className="rounded-md px-2 py-3 hover:bg-zinc-800 hover:text-white dark:hover:bg-white dark:hover:text-black">Настройки</Link>
                    <p className="rounded-md px-2 py-3 hover:bg-zinc-800 hover:text-white dark:hover:bg-white dark:hover:text-black cursor-pointer" onClick={() => store.logout()}>Выйти</p>
                </div>
            </Dropdown>
            <button className="sm:hidden">
                <IoMenu size={30} />
            </button>
        </header>
    )
})