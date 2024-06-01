import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { GoDash } from 'react-icons/go'
import { MdDeleteForever } from 'react-icons/md'
import { StoreContext } from '../../main'
import { TooltipContext } from '../../context/TooltipContext'
import { observer } from 'mobx-react-lite'

type FormValues = {
    files: PhotoCreate[]
}

export const UploadFilesForm = observer(() => {
    const { register, handleSubmit } = useForm<FormValues>();
    const { photoStore } = useContext(StoreContext).store

    const { setIsTooltipOpen } = useContext(TooltipContext)

    const onSubmit = (data: FormValues) => {
        data.files.forEach(file => {
            photoStore.createPhoto({ name: file.name, file: file.file })
        })
        photoStore.setPhotosForUpload([])
        setIsTooltipOpen(false)
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-between gap-4 p-4 rounded-lg bg-gray-300 dark:bg-zinc-700 relative h-full overflow-hidden">
            <div className="overflow-hidden h-full flex gap-2 flex-col">
                <div className="flex justify-between items-center">
                    <p>Фотографии для загрузки</p>
                    <p className="font-bold text-lg self-end cursor-pointer"><GoDash size={20} /></p>
                </div>
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
                                        onClick={(e) => {
                                            e.preventDefault()
                                            photoStore.removePhotoUpload(index)
                                        }}
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
    )
})