import { observer } from "mobx-react-lite"
import { useContext, useState } from "react"
import { HiDotsVertical } from "react-icons/hi"
import { API_URL } from "../../axios/axios"
import { StoreContext } from "../../main"
import { Modal } from "../Modal"
import { Dropdown } from "../Popup"
import { ImageModal } from "./ImageModal"


type MenuItem = {
    label: string
    action: () => void
}

type ImageProps = {
    photo: Photo
    onContextMenu?: () => void
    menuItems?: MenuItem[]
}

export const Image = observer(({ photo, onContextMenu, menuItems = [] }: ImageProps) => {
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
        photoStore.deletePhoto(photo)
        toggleModal()
    }

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    return (
        <>

            <div className="">

                <div
                    className="w-full aspect-square bg-gray-200 dark:bg-zinc-600 group cursor-pointer"
                    onClick={toggleModal}
                    onContextMenu={onContextMenu}
                >
                    <img className="w-full h-full object-cover" src={`${API_URL}/${photoStore.staticPath}${photo.userId}/${photo.filePath}`} alt={photo.filePath} />
                    <div className="opacity-0 absolute top-0 left-0 w-full h-full group-hover:opacity-100 transition-opacity flex items-center justify-center text-center bg-black/70">
                        <p className="text-white">{photo.name}</p>
                    </div>
                </div>
                {menuItems.length !== 0 &&
                    <div className="w-full absolute top-0 right-0 hover:bg-gray-500/40 dark:hover:bg-zinc-800/40">
                        <Dropdown
                            rendererElement={
                                <div className="self-end p-2 flex gap-2 items-center cursor-pointer text-white">
                                    <HiDotsVertical />
                                </div>
                            }
                        >
                            <div className="flex flex-col">
                                {menuItems.map((menuItem) => (
                                    <p key={menuItem.label} className="cursor-pointer text-sm" onClick={() => menuItem.action()}>{menuItem.label}</p>
                                ))}
                            </div>
                        </Dropdown>
                    </div>
                }
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