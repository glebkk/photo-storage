import axios, { AxiosError } from "axios";
import { makeAutoObservable } from "mobx";
import { toast } from "react-toastify";
import { AuthService } from "../api/AuthService";
import { User } from "../api/models/User";
import { AuthReponse } from "../api/models/response";
import { API_URL } from "../axios/axios";

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
                toast(err?.response?.data, { className: "bg-red-600 text-white", hideProgressBar: true })
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
                toast(err?.response?.data?.message, { className: "bg-red-600 text-white", hideProgressBar: true })
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
                toast(err?.response?.data, { className: "bg-red-600 text-white", hideProgressBar: true })
            }
            if (err instanceof String) {
                console.log(err);

                toast(err)
            }
        }
    }

    async updatePassword(oldPassword: string, newPassword: string) {
        try {
            const resp = await AuthService.updatePassword(oldPassword, newPassword)
            toast(resp?.data?.message, { className: "bg-green-600 text-white", hideProgressBar: true, closeButton: false })

        } catch (err) {
            if (err instanceof AxiosError) {
                toast(err?.response?.data?.message, { className: "bg-red-600 text-white", hideProgressBar: true, closeButton: false })
            }
        }

    }

}