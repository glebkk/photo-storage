import { ReactNode } from 'react'
import { createPortal } from 'react-dom'

type Props = {
    children: ReactNode
}

export const Modal = ({ children }: Props) => {
    const el = document.getElementById("modal-root")
    if (!el) return
    return createPortal(
        <div className='absolute z-20 w-full h-full top-0 left-0 bg-black/80 grid place-items-center'>
            {children}
        </div>,
        el
    )
}