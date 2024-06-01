import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import { MdDeleteForever } from "react-icons/md";
import { API_URL } from "../axios/axios";
import { Tooltip } from "../components/Tooltip";
import { TooltipContext } from "../context/TooltipContext";
import { StoreContext } from "../main";
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import { GoDash } from "react-icons/go";
import { useForm } from "react-hook-form";

type FormValues = {
    files: PhotoCreate[]
}

export const GalleryPage = observer(() => {
    const { isTooltipOpen, setIsTooltipOpen } = useContext(TooltipContext)
    const { photoStore } = useContext(StoreContext).store

    const { register, handleSubmit } = useForm<FormValues>();

    const onSubmit = (data: FormValues) => {
        console.log("data", data);
        data.files.forEach(file => {
            photoStore.createPhoto({ name: file.name, file: file.file })
        })
    };

    useEffect(() => {
        photoStore.getPhotos()
    }, [])

    function onDrop(e: React.DragEvent<HTMLDivElement>) {
        console.log(e)
        photoStore.setPhotosForUpload([...e.dataTransfer.files])
        setIsTooltipOpen(true)
    }


    function handleUpload(e: React.MouseEvent) {
        e.preventDefault()
        console.log(photoStore.photosForUpload);

        photoStore.photosForUpload.forEach(file => {
            photoStore.createPhoto({ name: file.name, file })
        })
    }

    return (
        <>
            <ToastContainer />
            <div className="min-h-full m-4 flex flex-col gap-2 relative">
                <h1 className="text-lg">Все фотографии</h1>
                <ImageList photos={photoStore.photos} />
                <DropZone onDrop={onDrop} dropText="Отпустите чтобы загрузить" />
                <Tooltip className="w-1/2 h-[90%]" isOpen={isTooltipOpen}>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-between gap-4 p-4 rounded-lg bg-gray-300 dark:bg-zinc-700 relative h-full overflow-hidden">
                        <div className="overflow-hidden h-full flex gap-2 flex-col">
                            <p className="font-bold text-lg self-end cursor-pointer"><GoDash size={20} /></p>
                            <div className="h-full overflow-y-auto flex flex-col gap-2">
                                {photoStore.photosForUpload.map((file, index) => (
                                    <div key={index} className="flex gap-2 items-center justify-between">
                                        <div className="flex gap-2 items-start w-full">
                                            <img className="h-32 aspect-square object-cover rounded-md" src={URL.createObjectURL(file)} alt="img" />
                                            <div className="flex flex-col gap-2 h-full w-full">
                                                <label htmlFor="">Название файла</label>
                                                <input
                                                    {...register(`files.${index}.name`)}
                                                    className="w-full"
                                                    type="text"
                                                    defaultValue={file.name}
                                                    required
                                                    placeholder="Введите название" />
                                                <button
                                                    className="self-start"
                                                    onClick={() => photoStore.removePhotoUpload(index)}
                                                >
                                                    <MdDeleteForever size={22} />
                                                </button>
                                            </div>
                                            <input
                                                {...register(`files.${index}.file`, { value: file })}
                                                type="hidden"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <button className="button-inverse">Добавить</button>
                            <button className="self-end" type="submit">Отправить</button>
                        </div>
                    </form>
                </Tooltip>
            </div>
        </>
    )
})

type DropZoneProps = {
    onDrop: (e: React.DragEvent<HTMLDivElement>) => void
    dropText: string
}

export const DropZone = ({ onDrop, dropText }: DropZoneProps) => {
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
                    className="absolute top-0 left-0 w-full h-full bg-transparent text-white text-center"
                    onDragStart={(e) => dragStartHandler(e)}
                    onDragOver={(e) => dragStartHandler(e)}
                    onDragLeave={(e) => dragLeaveHandler(e)}
                />
            }
        </>
    )
}

export const ImageList = ({ photos }: { photos: Photo[] }) => {
    if (!photos || photos.length == 0) {
        return <div>У вас не фотографий</div>
    }

    return (
        <div className="w-full grid grid-cols-4 gap-4 lg:grid-cols-4">
            {photos.map(img => (
                <Image key={img.id} photo={img} />
            ))}
        </div>
    )
}

export const Image = observer(({ photo }: { photo: Photo }) => {
    const { photoStore } = useContext(StoreContext).store

    return (
        <div className="w-full aspect-square rounded-lg bg-gray-200 dark:bg-zinc-600 transition-shadow hover:shadow-inner overflow-hidden">
            <img className="w-full h-full object-cover" src={`${API_URL}/${photoStore.staticPath}${photo.userId}/${photo.filePath}`} alt={photo.filePath} />
            <p>{photo.name}</p>
        </div>
    )
})