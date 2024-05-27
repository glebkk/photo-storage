import { ComponentProps } from "react"
import { CiLight } from "react-icons/ci"
import { MdDarkMode } from "react-icons/md"
import { useTheme } from "../../context/ThemeContext"

type ThemeSwitcherProps = ComponentProps<"button">

export function ThemeSwitcher({ className, ...props }: ThemeSwitcherProps) {
    const {theme, toggleTheme} = useTheme()
    
    return (
        <button className={className} {...props} onClick={toggleTheme}>
            {theme === "dark" && <MdDarkMode size={20} />}
            {theme === "light" && <CiLight size={20} />}
        </button>
    )
}