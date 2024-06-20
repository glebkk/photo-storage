import { useContext } from "react";
import { IoIosClose } from "react-icons/io";
import { API_URL } from "../../axios/axios";
import { StoreContext } from "../../main";
import { observer } from "mobx-react-lite";

type ImageModalProps = {
    photo: Photo;
    scale: number;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onClose: () => void;
    onDelete: () => void;
};

export const ImageModal = observer(({
    photo,
    scale,
    onZoomIn,
    onZoomOut,
    onClose
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
            <div className="p-4 bg-gray-200 dark:bg-zinc-800 w-full flex justify-end items-center">
                <div className="flex items-center self-end">
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
            </div>
        </div>
    );
});