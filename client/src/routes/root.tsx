import { observer } from "mobx-react-lite";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Header } from "../components/Layout/Header";
import { Sidebar } from "../components/Layout/Sidebar";
import { FileProvider } from "../context/FileContext";
import { TooltipProvider } from "../context/TooltipContext";

export const Root = observer(function () {
    return (
        <>
            <ToastContainer />
            <div className="h-screen flex flex-col gap-2 sm:flex-row">
                <Sidebar />
                <TooltipProvider>
                    <div className="w-full flex flex-col gap-2">
                        <Header />
                        <div className="overflow-y-auto h-full bg-white rounded-lg dark:bg-zinc-800 p-4">
                            <Outlet />
                        </div>
                    </div>
                </TooltipProvider>
            </div>
        </>
    );
})

