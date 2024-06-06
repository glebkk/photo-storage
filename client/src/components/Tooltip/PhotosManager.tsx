import { useContext, useState } from 'react'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import { IoClose } from 'react-icons/io5'
import { TooltipContext } from '../../context/TooltipContext'
import { UploadFilesForm } from '../Forms/UploadFilesForm'
import { Tooltip } from './Tooltip'
import { StoreContext } from '../../main'
import { observer } from 'mobx-react-lite'

type Props = {
    onClose?: () => void
}

// TODO fix
export const PhotosManager = observer(({ onClose }: Props) => {
    const { isTooltipOpen, setIsTooltipOpen } = useContext(TooltipContext)
    const [isOpen, setIsOpen] = useState(true)
    const {photoStore} = useContext(StoreContext).store

    if(!photoStore.photosForUpload || photoStore.photosForUpload.length === 0){
        return
    }

    function handleClose() {
        if (onClose) {
            onClose()
        }
        setIsTooltipOpen(false)
    }
    return (
        <Tooltip className="w-1/2" isOpen={isTooltipOpen}>
            <div className="flex max-h-[70vh] flex-col justify-between gap-4 p-4 rounded-lg bg-gray-300 dark:bg-zinc-700 h-full">
                <div className="flex justify-between items-center">
                    <p>Загрузка</p>
                    <div className="font-bold text-lg self-end cursor-pointer flex gap-2">
                        <p onClick={() => setIsOpen(prev => !prev)}>
                            {isOpen ? <IoIosArrowDown size={20} /> : <IoIosArrowUp size={20} />}
                        </p>
                        <p onClick={handleClose}><IoClose size={20} /></p>
                    </div>
                </div>
                {isOpen &&
                    <UploadFilesForm files={photoStore.photosForUpload} />
                }
            </div>
        </Tooltip>
    )
})