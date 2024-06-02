import { observer } from "mobx-react-lite";
import { ReactNode, useContext, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { API_URL } from "../axios/axios";
import { UploadFilesForm } from "../components/Forms/UploadFilesForm";
import { Tooltip } from "../components/Tooltip";
import { TooltipContext } from "../context/TooltipContext";
import { StoreContext } from "../main";



export const GalleryPage = observer(() => {
    const { isTooltipOpen, setIsTooltipOpen } = useContext(TooltipContext)
    const { photoStore } = useContext(StoreContext).store

    

    useEffect(() => {
        photoStore.getPhotos()
    }, [])

    function onDrop(e: React.DragEvent<HTMLDivElement>) {
        console.log(e)
        photoStore.appendPhotosForUpload([...e.dataTransfer.files])
        setIsTooltipOpen(true)
    }

    return (
        <DropZone onDrop={onDrop} dropText="Отпустите чтобы загрузить">
            <ToastContainer />
            <div className="min-h-full flex flex-col gap-2 relative">
                <h1 className="text-lg">Все фотографии</h1>
                <ImageList photos={photoStore.photos} />
                <Tooltip className="w-1/2 h-[90%]" isOpen={isTooltipOpen}>
                    <UploadFilesForm />
                </Tooltip>
            </div>
        </DropZone>
    )
})

type DropZoneProps = {
    onDrop: (e: React.DragEvent<HTMLDivElement>) => void
    dropText: string
    children: ReactNode
}

export const DropZone = ({ onDrop, dropText, children }: DropZoneProps) => {
    const [drag, setDrag] = useState(false)

    function dragStartHandler(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault()
        setDrag(true)
    }

    function dragLeaveHandler(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault()
        setDrag(false)
    }

    function onDropHandler(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault()
        onDrop(e)
        setDrag(false)
    }
    return (
        <>
            {drag ?
                <div
                    className="fixed left-0 top-0 grid place-items-center w-full h-full bg-zinc-900/80 text-white text-center text-2xl border-2 border-dashed border-white"
                    onDragStart={(e) => dragStartHandler(e)}
                    onDragOver={(e) => dragStartHandler(e)}
                    onDragLeave={(e) => dragLeaveHandler(e)}
                    onDrop={(e) => onDropHandler(e)}
                >
                    {dropText}
                </div> :
                <div
                    className=""
                    onDragStart={(e) => dragStartHandler(e)}
                    onDragOver={(e) => dragStartHandler(e)}
                    onDragLeave={(e) => dragLeaveHandler(e)}
                >
                    {children}
                </div>
            }
        </>
    )
}

export const ImageList = ({ photos }: { photos: Photo[] }) => {
    if (!photos || photos.length == 0) {
        return <div>У вас не фотографий</div>
    }

    return (
        <div className="w-full grid grid-cols-2 gap-4 md:grid-cols-4">
            {photos.map(img => (
                <Image key={img.id} photo={img} />
            ))}
        </div>
    )
}

export const Image = observer(({ photo }: { photo: Photo }) => {
    const { photoStore } = useContext(StoreContext).store

    return (
        <div className="w-full relative aspect-square rounded-lg bg-gray-200 dark:bg-zinc-600 group cursor-pointer overflow-hidden">
            <img className="w-full h-full object-cover" src={`${API_URL}/${photoStore.staticPath}${photo.userId}/${photo.filePath}`} alt={photo.filePath} />
            <div className="opacity-0 absolute top-0 left-0 w-full h-full group-hover:opacity-100 transition-opacity flex items-center justify-center text-center bg-black/70">
                <p className="text-white">{photo.name}</p>
            </div>
        </div>
    )
})