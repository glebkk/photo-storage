import { useContext } from "react"
import { useForm } from "react-hook-form"
import { Link, Navigate, useLocation } from "react-router-dom"
import { StoreContext } from "../main"
import { observer } from "mobx-react-lite"


type RegisterForm = {
  login: string,
  password: string,
  confirmPassword: string
}

export const RegisterPage = observer(() => {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>()

  const location = useLocation()

  const { store } = useContext(StoreContext)

  const onSubmit = handleSubmit((data) => {
    store.register(data.login, data.password)
  })

  if (store.isAuth) {
    return <Navigate to={"/"} state={{ from: location }} />
  }


  return (
    <div className="w-full h-screen grid place-items-center overflow-hidden">
      <div className="w-1/3 p-6 bg-white dark:bg-zinc-800 rounded-lg flex flex-col gap-4 shadow-sm">
        <h1 className="text-xl">Регистрация</h1>
        <form className="flex flex-col gap-2" onSubmit={onSubmit}>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between">
              <label htmlFor="login">Логин</label>
              {errors?.login?.type === "required" && <p className="text-red-400 text-sm">Введите логин</p>}
              {errors?.login?.type === "minLength" && <p className="text-red-400 text-sm">Минимальная длина логина 5  символов</p>}
              {errors?.login?.type === "maxLength" && <p className="text-red-400 text-sm">Максимальная длина логина 12 символов</p>}
            </div>
            <input {...register("login", { required: true, minLength: 5, maxLength: 12 })} type="text" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between">
              <label htmlFor="login">Пароль</label>
              {errors?.password?.type === "required" && <p className="text-red-400 text-sm">Введите пароль</p>}
              {errors?.password?.type === "minLength" && <p className="text-red-400 text-sm">Минимальная длина пароля 8 символов</p>}
              {errors?.password?.type === "maxLength" && <p className="text-red-400 text-sm">Максимальная длина пароля 20 символов</p>}
            </div>
            <input {...register("password", { required: true, minLength: 8, maxLength: 20 })} type="password" />
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
                if (watch('password') != val) {
                  return "Пароли должны совпадать";
                }
              },
            })} />
          </div>
          <div>
            <p className="text-sm text-gray-500 inline">Есть аккаунт? - </p><Link className="text-sm" to={"/login"}>Войти</Link>
          </div>
          <button>Зарегистрироваться</button>
        </form>
      </div>
    </div>
  )
})