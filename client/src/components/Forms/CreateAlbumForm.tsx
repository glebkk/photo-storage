import { useContext } from "react"
import { useForm } from "react-hook-form"
import { StoreContext } from "../../main"

type Props = {
    onSubmit?: () => void
}

type CreateAlbumForm = {
    name: string
}

export const CreateAlbumForm = ({ onSubmit, ...props }: Props) => {
    const { albumsStore } = useContext(StoreContext).store


    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateAlbumForm>()

    const onSubmitForm = handleSubmit((data) => {
        albumsStore.createAlbum(data.name)
        if(onSubmit){
            onSubmit()
        }
    })

    return (
        <form className="flex flex-col gap-4" onSubmit={onSubmitForm} {...props}>
            <div className="flex flex-col gap-1">
                <div className="flex justify-between">
                    <label htmlFor="login">Названи альбома</label>
                    {errors?.name?.type === "required" && <p className="text-red-400 text-sm">Введите название</p>}
                    {errors?.name?.type === "minLength" && <p className="text-red-400 text-sm">Минимальная длина названия 3 символа</p>}
                    {errors?.name?.type === "maxLength" && <p className="text-red-400 text-sm">Максимальная длина пароля 20 символов</p>}
                </div>
                <input {...register("name", { required: true, minLength: 3, maxLength: 20 })} type="text" />
            </div>
            <button className="bg-green-600 text-white">Создать</button>
        </form>
    )
}