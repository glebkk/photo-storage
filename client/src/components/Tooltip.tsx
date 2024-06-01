import { ComponentProps, ReactNode } from "react"
import { twMerge } from "tailwind-merge"

type Props = {
    children: ReactNode
    isOpen: boolean
} & ComponentProps<"div">

export const Tooltip = ({ children, isOpen, className }: Props) => {
    return (
        <>
            {isOpen &&
                <div className={twMerge("fixed bottom-5 right-5", className)}>
                    {children}
                </div >
            }
        </>
    )
}