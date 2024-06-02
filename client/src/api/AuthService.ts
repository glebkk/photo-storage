import { AxiosResponse } from "axios";
import { instance } from "../axios/axios";
import { AuthReponse, UpdatePasswordResponse } from "./models/response";

export class AuthService {

    static async register(login: string, password: string): Promise<AxiosResponse<AuthReponse>> {
        return instance.post<AuthReponse>("/auth/register", { login, password })
    }

    static async login(login: string, password: string): Promise<AxiosResponse<AuthReponse>> {
        return instance.post<AuthReponse>("/auth/login", { login, password })
    }

    static refreshToken() {
        return instance.post("/auth/refresh");
    }

    static logout(): Promise<void> {
        return instance.post("/auth/logout")
    }

    static updatePassword(oldPassword: string, newPassword: string): Promise<AxiosResponse<UpdatePasswordResponse>> {
        return instance.put<UpdatePasswordResponse>("/user/password", {oldPassword, newPassword})
    }
    
}