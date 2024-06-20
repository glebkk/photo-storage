import axios, { AxiosError } from "axios";
import { makeAutoObservable } from "mobx";
import { toast } from "react-toastify";
import { AuthService } from "../api/AuthService";
import { User } from "../api/models/User";
import { AuthReponse } from "../api/models/response";
import { API_URL } from "../axios/axios";
import { toastError, toastErrorUpdate, toastSettings, toastSuccessUpdate } from "../utils/toast";

export class AuthStore {
    user = {} as User
    isAuth = false;
    isLoading = false;

    constructor() {
        makeAutoObservable(this);
    }

    setAuth(bool: boolean) {
        this.isAuth = bool
    }


    setUser(user: User) {
        this.user = user
    }

    setIsLoading(bool: boolean) {
        this.isLoading = bool
    }

    async login(login: string, password: string) {
        try {
            const resp = await AuthService.login(login, password);
            localStorage.setItem("token", resp.data.access_token);
            this.setAuth(true);
            this.setUser(resp.data.user)
        } catch (err: unknown) {
            if (err instanceof AxiosError) {
                toastError(err?.response?.data?.message)
            }
            if (err instanceof String) {
                console.log(err);
                toast(err)
            }
        }
    }

    async register(login: string, password: string) {
        try {
            const resp = await AuthService.register(login, password);
            localStorage.setItem("token", resp.data.access_token);
            this.setAuth(true);
            this.setUser(resp.data.user)
        } catch (err: unknown) {
            if (err instanceof AxiosError) {
                toastError(err?.response?.data?.message)
            }
            if (err instanceof String) {
                console.log(err);

                toast(err)
            }
        }
    }

    async checkAuth() {
        this.setIsLoading(true);
        try {
            const resp = await axios.get<AuthReponse>(`${API_URL}/auth/refresh`, { withCredentials: true })
            localStorage.setItem("token", resp.data.access_token);
            this.setAuth(true)
            this.setUser(resp.data.user)
        } catch (err) {
            console.log("check auth error", err);
        } finally {
            this.setIsLoading(false);
        }
    }

    async logout() {
        try {
            await AuthService.logout();
            this.setAuth(false);
            this.setUser({} as User)
            localStorage.removeItem("token");
        } catch (err: unknown) {
            console.log("logout err: ", err);
            if (err instanceof AxiosError) {
                toastError(err?.response?.data)
            }
            if (err instanceof String) {
                console.log(err);

                toast(err)
            }
        }
    }

    async updatePassword(oldPassword: string, newPassword: string) {
        const toastId = toast.loading("Загрузка", toastSettings)
        
        try {
            const resp = await AuthService.updatePassword(oldPassword, newPassword)
            toastSuccessUpdate(toastId, resp?.data?.message)
        } catch (err) {
            if (err instanceof AxiosError) {
                toastErrorUpdate(toastId, err?.response?.data?.message)
            }
        }

    }

}