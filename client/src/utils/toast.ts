import { Id, toast } from "react-toastify"
import { capitalize } from "./string"

export const toastError = (text: string) => {
    toast(capitalize(text), { autoClose: 1000, className: "bg-red-600 text-white", hideProgressBar: true })
}

export const toastSuccess = (text: string) => {
    toast(capitalize(text), { autoClose: 1000, className: "bg-green-600 text-white", hideProgressBar: true })
}

export const toastSuccessUpdate = (id: Id, text: string) => {
    toast.update(id, {render: capitalize(text), autoClose: 1000, className: "bg-green-600 text-white", hideProgressBar: true, isLoading: false })
}

export const toastErrorUpdate = (id: Id, text: string) => {
    toast.update(id, {render: capitalize(text), autoClose: 1000, className: "bg-red-600 text-white", hideProgressBar: true, isLoading: false })
}

export const toastSettings = { hideProgressBar: true }
export const toastSuccessSettings = { autoClose: 1000, className: "bg-green-600 text-white", isLoading: false, }
export const toastErrorSetting = { autoClose: 1000, className: "bg-red-600 text-white", isLoading: false, }