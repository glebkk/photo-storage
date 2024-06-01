import { Outlet } from "react-router-dom";
import { Header } from "../components/Layout/Header";
import { Sidebar } from "../components/Layout/Sidebar";
import { observer } from "mobx-react-lite";
import { TooltipProvider } from "../context/TooltipContext";
import { FileProvider } from "../context/FileContext";

export const Root = observer(function () {
    return (
        <div className="h-screen flex flex-col gap-2 sm:flex-row">
            <Sidebar />

            <FileProvider>
                <TooltipProvider>
                    <div className="w-full flex flex-col gap-2">
                        <Header />
                        <div className="overflow-y-auto h-full bg-white rounded-lg dark:bg-zinc-800">
                            <Outlet />
                        </div>
                    </div>
                </TooltipProvider>
            </FileProvider>
        </div>
    );
})

