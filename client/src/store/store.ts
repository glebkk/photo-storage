import { makeAutoObservable } from "mobx";
import { AuthService } from "../api/AuthService";
import { User } from "../api/models/User";
import axios from "axios";
import { API_URL } from "../axios/axios";
import { AuthReponse } from "../api/models/response";

export default class Store {
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
        } catch (err) {
            console.log("login error", err);
        }
    }

    async register(login: string, password: string) {
        try {
            const resp = await AuthService.register(login, password);
            localStorage.setItem("token", resp.data.access_token);
            this.setAuth(true);
            this.setUser(resp.data.user)
        } catch (err) {
            console.log("register error", err);
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
        } catch (err) {
            console.log("logout error");
        }
    }

}
