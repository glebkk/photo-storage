import { observer } from "mobx-react-lite";
import { ReactNode, createRef, useContext, useState } from "react";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { GroupingSelector, GroupingType } from "../components/GroupingSelector";
import { Image } from "../components/Images/Image";
import { PhotosManager } from "../components/Tooltip/PhotosManager";
import { TooltipContext } from "../context/TooltipContext";
import { StoreContext } from "../main";


export const GalleryPage = observer(() => {
    const { setIsTooltipOpen } = useContext(TooltipContext)
    const { photoStore } = useContext(StoreContext).store
    const [groupingType, setGroupingType] = useState<GroupingType>('year');
    const inputRef = createRef<HTMLInputElement>()



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

export const ImageList = observer(({ photos, groupingType = "year" }: { photos: Photo[], groupingType?: GroupingType }) => {
    const { photoStore } = useContext(StoreContext).store

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
                            <div className="relative rounded-lg overflow-hidden" key={photo.id}>
                                <Image photo={photo} menuItems={[{label:"Удалить", action: () => photoStore.deletePhoto(photo)}]} />
                            </div>
                        )}
                    </div>
                </div >
            ))}

        </>
    )
})
