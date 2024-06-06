import { observer } from 'mobx-react-lite'
import { ComponentProps, useContext } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { MdDeleteForever } from 'react-icons/md'
import { StoreContext } from '../../main'
import { twMerge } from 'tailwind-merge'

type FormValues = {
    files: PhotoCreate[]
}

type Props = {
    files: File[]
} & ComponentProps<"form">

export const UploadFilesForm = observer(({ className, files }: Props) => {
    const { control, register, handleSubmit } = useForm<FormValues>();
    const { remove } = useFieldArray<FormValues>({
        control,
        name: "files"
    })
    const { photoStore } = useContext(StoreContext).store

    const onSubmit = (data: FormValues) => {
        data.files.forEach(file => {
            photoStore.createPhoto({ name: file.name, file: file.file })
        })
        photoStore.setPhotosForUpload([])
    };
    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className={twMerge("min-h-full flex flex-col gap-2 justify-between overflow-hidden", className)}
        >
            <div className="max-h-full overflow-y-auto flex flex-col gap-2">
                {files.map((file, index) => (
                    <div key={file.name + index} className="flex gap-2 items-center justify-between">
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
                                    remove(index)
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
                ))}
            </div>
            <div className="flex w-full justify-end">
                <button className="self-end" type="submit">Отправить</button>
            </div>
        </form>
    )
})