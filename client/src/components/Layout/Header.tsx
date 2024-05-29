import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { IoMenu } from "react-icons/io5";
import { StoreContext } from "../../main";


export const Header = observer(() => {
    const { store } = useContext(StoreContext)

    return (
        <header className="w-full px-4 py-2 flex gap-2 justify-end h-16 rounded-b-lg bg-white dark:bg-zinc-800">
            <div className='flex gap-2 items-center'>
                <div className="rounded-full overflow-hidden bg-gray-300">
                    <img className="w-full h-full " src="vite.svg" alt="" />
                </div>
                <p>{store.user.login}</p>
                <button onClick={() => store.logout()}>Выйти</button>
            </div>
            <button className="sm:hidden">
                <IoMenu size={30} />
            </button>
        </header>
    )
})