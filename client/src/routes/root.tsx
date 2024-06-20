import { observer } from "mobx-react-lite";
import { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Header } from "../components/Layout/Header";
import { Sidebar } from "../components/Layout/Sidebar";
import { TooltipProvider } from "../context/TooltipContext";
import { StoreContext } from "../main";

export const Root = observer(function () {
    const { photoStore, albumsStore } = useContext(StoreContext).store

    useEffect(() => {
        photoStore.getPhotos()
        albumsStore.getAlbums()
    }, [])

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

