import { IoMenu } from "react-icons/io5";


type Props = {}

export const Header = (props: Props) => {
    return (
        <header className="w-full px-4 py-2 flex gap-2 justify-end h-16 rounded-b-lg bg-white dark:bg-zinc-800">
            <div className='flex gap-2 items-center'>
                <div className="rounded-full overflow-hidden bg-gray-300">
                    <img className="w-full h-full " src="vite.svg" alt="" />
                </div>
                <p>Name</p>
            </div>
            <button className="sm:hidden">
                <IoMenu size={30}/>
            </button>
        </header>
    )
}