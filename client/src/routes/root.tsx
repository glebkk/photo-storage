import { Outlet } from "react-router-dom";
import { Header } from "../components/Layout/Header";
import { Sidebar } from "../components/Layout/Sidebar";

export function Root() {

    return (
        <div className="flex flex-col gap-2 sm:flex-row">
            <Sidebar />

            <div className="w-full flex flex-col gap-2">
                <Header />
                <div className="w-full h-full p-2 bg-white rounded-lg dark:bg-zinc-800">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

