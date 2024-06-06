import { ComponentProps, ReactNode } from "react"
import { createPortal } from "react-dom"
import { twMerge } from "tailwind-merge"

type Props = {
    children: ReactNode
    isOpen: boolean
} & ComponentProps<"div">

export const Tooltip = ({ children, isOpen, className }: Props) => {
    if (!isOpen) return null
    return createPortal(
        <div className={twMerge("fixed bottom-5 right-5", className)}>
            {children}
        </div >,
        document.body
    )
}