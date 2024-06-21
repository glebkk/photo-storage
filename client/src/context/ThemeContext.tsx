import { useLocalStorage } from "@uidotdev/usehooks";
import { ReactNode, createContext, useContext, useEffect } from "react";

type Theme = 'light' | 'dark'

interface ThemeContextProps {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined)

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useLocalStorage<"light" | "dark">("theme", window.matchMedia('(prefers-color-scheme: dark)').matches && "dark" || "light")
    // const [theme, setTheme] = useState<"light" | "dark">()
    function toggleTheme() {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark')
    }

    useEffect(() => {
        if (theme === 'dark') {
            setTheme('dark')
            document.documentElement.classList.add('dark')
        } else if (theme === 'light') {
            setTheme('light')
            document.documentElement.classList.remove('dark')
        }
    }, [theme])

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (!context) {
        throw Error('useTheme must be used within a ThemeProvider')
    }

    return context;
}

