import { ComponentProps, useContext } from 'react'
import { useForm } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'
import { StoreContext } from '../../main'

type Props = ComponentProps<"form">

type ChangePasswordForm = {
    oldPassword: string
    newPassword: string
    confirmPassword: string
}

export const ChangePasswordForm = ({className, ...props}: Props) => {
    const { authStore } = useContext(StoreContext).store


    const {
        register,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm<ChangePasswordForm>()

    const onSubmit = handleSubmit((data) => {
        console.log(data);
        
        authStore.updatePassword(data.oldPassword, data.newPassword)
    })

    return (
        <form className={twMerge("flex flex-col gap-2", className)} onSubmit={onSubmit} {...props}>
            <div className="flex flex-col gap-1">
                <div className="flex justify-between">
                    <label htmlFor="login">Старый пароль</label>
                    {errors?.oldPassword?.type === "required" && <p className="text-red-400 text-sm">Введите старый пароль</p>}
                    {errors?.oldPassword?.type === "minLength" && <p className="text-red-400 text-sm">Минимальная длина пароля 8 символов</p>}
                    {errors?.oldPassword?.type === "maxLength" && <p className="text-red-400 text-sm">Максимальная длина пароля 20 символов</p>}
                </div>
                <input {...register("oldPassword", { required: true, minLength: 8, maxLength: 20 })} type="password" />
            </div>
            <div className="flex flex-col gap-1">
                <div className="flex justify-between">
                    <label htmlFor="login">Новый пароль</label>
                    {errors?.newPassword?.type === "required" && <p className="text-red-400 text-sm">Введите новый пароль</p>}
                    {errors?.newPassword?.type === "minLength" && <p className="text-red-400 text-sm">Минимальная длина пароля 8 символов</p>}
                    {errors?.newPassword?.type === "maxLength" && <p className="text-red-400 text-sm">Максимальная длина пароля 20 символов</p>}
                </div>
                <input {...register("newPassword", { required: true, minLength: 8, maxLength: 20 })} type="password" />
            </div>
            <div className="flex flex-col gap-1">
                <div className="flex justify-between">
                    <label htmlFor="login">Подтвердите пароль</label>
                    {errors?.confirmPassword?.type === "validate" && <p className="text-red-400 text-sm">{errors.confirmPassword.message}</p>}
                    {errors?.confirmPassword?.type === "required" && <p className="text-red-400 text-sm">Повторите пароль</p>}
                </div>
                <input type="password" {...register("confirmPassword", {
                    required: true,
                    validate: (val: string) => {
                        if (watch('newPassword') != val) {
                            return "Пароли должны совпадать";
                        }
                    },
                })} />
            </div>
            <button>Изменить</button>
        </form>
    )
}