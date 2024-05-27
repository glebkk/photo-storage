import { useLocalStorage } from "@uidotdev/usehooks";
import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";
import { redirect } from "react-router-dom";


type User = {
    id: string,
    name: string
}

interface AuthContextProps {
    user: User | null;
    login: (data: User) => void;
    register: (data: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);


export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken_] = useState(localStorage.getItem("token"));


    // call this function when you want to authenticate the user
    

    return <AuthContext.Provider value={}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw Error("use only with AuthProvider")
    }
    return context;
};