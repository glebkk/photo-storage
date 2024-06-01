import { ReactNode, createContext, useState } from 'react';

type TooltipContextState = {
    isTooltipOpen: boolean
    toggleTooltip: () => void
    setIsTooltipOpen: (bool: boolean) => void
}

export const TooltipContext = createContext<TooltipContextState>({
    isTooltipOpen: false,
    toggleTooltip() {
        
    },
    setIsTooltipOpen(bool: boolean) {

    }
});

export const TooltipProvider = ({ children }: { children: ReactNode }) => {
    const [isTooltipOpen, setIsTooltipOpen] = useState(false);

    const toggleTooltip = () => {
        setIsTooltipOpen((prevState) => !prevState);
    };

    return (
        <TooltipContext.Provider value={{ isTooltipOpen, toggleTooltip, setIsTooltipOpen}}>
            {children}
        </TooltipContext.Provider>
    );
};