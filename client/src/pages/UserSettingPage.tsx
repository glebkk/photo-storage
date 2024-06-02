import { useContext } from "react"
import { StoreContext } from "../main"
import { ChangePasswordForm } from "../components/Forms/ChangePasswordForm"

export const UserSettingPage = () => {
  const { authStore } = useContext(StoreContext).store

  return (
    <div className="min-h-full flex flex-col gap-2 relative">
      <h1 className="text-lg">Изменить пароль</h1>
        <ChangePasswordForm className="w-1/2"/>
    </div>
  )
}