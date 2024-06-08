import { toast } from "react-toastify"
import { capitalize } from "./string"

export const errorToast = (text: string) => {
    toast(capitalize(text), { className: "bg-red-600 text-white", hideProgressBar: true })
}

export const successToast = (text: string) => {
    toast(capitalize(text), { className: "bg-green-600 text-white", hideProgressBar: true })
}