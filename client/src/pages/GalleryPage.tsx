import { observer } from "mobx-react-lite";
import { ReactNode, createRef, useContext, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { API_URL } from "../axios/axios";
import { GroupingSelector, GroupingType } from "../components/GroupingSelector";
import { PhotosManager } from "../components/Tooltip/PhotosManager";
import { TooltipContext } from "../context/TooltipContext";
import { StoreContext } from "../main";
import { Modal } from "../components/Modal";
import { IoIosClose } from "react-icons/io";



export const GalleryPage = observer(() => {
    const { setIsTooltipOpen } = useContext(TooltipContext)
    const { photoStore } = useContext(StoreContext).store
    const [groupingType, setGroupingType] = useState<GroupingType>('year');
    const inputRef = createRef<HTMLInputElement>()

    useEffect(() => {
        photoStore.getPhotos()
    }, [])

    console.log("rerender gallery page");

    function onDrop(e: React.DragEvent<HTMLDivElement>) {
        photoStore.appendPhotosForUpload([...e.dataTransfer.files])
        setIsTooltipOpen(true)
    }

    const handleClose = () => {
        photoStore.setPhotosForUpload([])
    }

    return (
        <DropZone onDrop={onDrop} dropText="Отпустите чтобы загрузить">
            <ToastContainer />
            <div className="min-h-full flex flex-col gap-2 relative">
                <h1 className="text-lg">Все фотографии</h1>
                <div className="flex border-y-2 border-white/20 p-2 gap-4">
                    <button className="" onClick={() => {
                        inputRef.current?.click()
                    }}>Загрузить</button>
                    <input onChange={e => {
                        if (!e.target.files) {
                            return
                        }
                        photoStore.appendPhotosForUpload([...e.target.files])
                        setIsTooltipOpen(true)
                    }} type="file" multiple hidden accept="image/*" ref={inputRef} />
                    <div className="h-auto w-[2px] bg-black/10 dark:bg-white/10"></div>
                    <GroupingSelector groupingType={groupingType} onGroupingTypeChange={setGroupingType} />
                </div>
                <ImageList photos={photoStore.photos} groupingType={groupingType} />
                <PhotosManager onClose={handleClose} />
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

    function dragStartHandler(e: React.DragEvent) {
        e.preventDefault();
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

export const ImageList = ({ photos, groupingType }: { photos: Photo[], groupingType: GroupingType }) => {
    if (!photos || photos.length === 0) {
        return <div>У вас не фотографий</div>
    }

    const groupedPhotos: GroupedPhotos = photos.reduce((acc, photo) => {
        const createdAt = new Date(photo.createdAt)
        const month = `${createdAt.toLocaleString('default', { month: 'long' })}`
        const day = `${createdAt.getDate()}`
        const year = `${createdAt.getFullYear()}`
        const key = groupingType === 'year'
            ? year
            : groupingType === 'month'
                ? `${month} ${year}г.`
                : `${day} ${month} ${year}г.`;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(photo);
        return acc;
    }, {} as GroupedPhotos);

    return (
        <>
            {Object.keys(groupedPhotos).map((key) => (
                <div key={key} className="flex flex-col gap-2">
                    <p className="capitalize">{key}</p>
                    <div className="w-full grid grid-cols-2 gap-4 md:grid-cols-6">
                        {groupedPhotos[key].map(photo =>
                            <Image key={photo.id} photo={photo} />
                        )}
                    </div>
                </div>
            ))}

        </>
    )
}

export const Image = observer(({ photo }: { photo: Photo }) => {
    const { photoStore } = useContext(StoreContext).store
    const [showModal, setShowModal] = useState(false);
    const [scale, setScale] = useState(1);

    const handleZoomIn = () => {
        setScale((prevScale) => prevScale / 0.75);
    };

    const handleZoomOut = () => {
        setScale((prevScale) => prevScale * 0.75);
    };

    function handleDelete() {
        photoStore.deletePhoto(photo.name)
        toggleModal()
    }

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    return (
        <>

            <div
                className="w-full relative aspect-square rounded-lg bg-gray-200 dark:bg-zinc-600 group cursor-pointer overflow-hidden"
                onClick={toggleModal}
            >
                <img className="w-full h-full object-cover" src={`${API_URL}/${photoStore.staticPath}${photo.userId}/${photo.filePath}`} alt={photo.filePath} />
                <div className="opacity-0 absolute top-0 left-0 w-full h-full group-hover:opacity-100 transition-opacity flex items-center justify-center text-center bg-black/70">
                    <p className="text-white">{photo.name}</p>
                </div>

            </div>
            {showModal &&
                <Modal>
                    <ImageModal
                        photo={photo}
                        scale={scale}
                        onZoomIn={handleZoomIn}
                        onZoomOut={handleZoomOut}
                        onClose={toggleModal}
                        onDelete={handleDelete}
                    />
                </Modal>
            }
        </>
    )
})

type ImageModalProps = {
    photo: Photo;
    scale: number;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onClose: () => void;
    onDelete: () => void;
};

const ImageModal = ({
    photo,
    scale,
    onZoomIn,
    onZoomOut,
    onClose,
    onDelete,
}: ImageModalProps) => {
    const { photoStore } = useContext(StoreContext).store

    return (
        <div className="relative w-full h-full bg-gray-200 dark:bg-zinc-800 flex flex-col">
            <div className="flex justify-end p-2 cursor-pointer" onClick={onClose}>
                <IoIosClose size={24} />
            </div>
            <div className="flex-grow relative">
                <div className="absolute inset-0 flex justify-center items-center overflow-auto">
                    <img
                        onDragStart={e => e.stopPropagation()}
                        className={`max-w-full max-h-full object-contain transition-transform duration-300`}
                        style={{ transform: `scale(${scale})` }}
                        src={`${API_URL}/${photoStore.staticPath}${photo.userId}/${photo.filePath}`}
                        alt=""
                    />
                </div>
            </div>
            <div className="p-4 bg-gray-200 dark:bg-zinc-800 flex justify-between items-center">
                <div className="flex items-center">
                    <button
                        className="font-bold py-2 px-4 rounded mr-2"
                        onClick={onZoomIn}
                    >
                        +
                    </button>
                    <button
                        className="font-bold py-2 px-4 rounded"
                        onClick={onZoomOut}
                    >
                        -
                    </button>
                    <span className="ml-4 text-gray-500">{Math.round(scale * 100)}%</span>
                </div>
                <button
                    className="bg-red-500 hover:bg-red-700 text-white hover:text-white dark:hover-text-white font-bold py-2 px-4 rounded"
                    onClick={onDelete}
                >
                    Удалить
                </button>
            </div>
        </div>
    );
};
