import axios, { AxiosError } from "axios";
import { makeAutoObservable } from "mobx";
import { toast } from "react-toastify";
import { AuthService } from "../api/AuthService";
import { PhotoService } from "../api/PhotoService";
import { User } from "../api/models/User";
import { AuthReponse } from "../api/models/response";
import { API_URL } from "../axios/axios";


export class RootStore {
    authStore: AuthStore
    photoStore: PhotoStore

    constructor() {
        this.authStore = new AuthStore()
        this.photoStore = new PhotoStore()
    }
}

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
                toast(err?.response?.data, { className: "bg-red-600", hideProgressBar: true })
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
                toast(err?.response?.data?.message, { className: "bg-red-600", hideProgressBar: true })
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
                toast(err?.response?.data, { className: "bg-red-600", hideProgressBar: true })
            }
            if (err instanceof String) {
                console.log(err);

                toast(err)
            }
        }
    }

}

export class PhotoStore {
    photos = [] as Photo[]
    photosForUpload: File[] = [];
    staticPath = "public/"


    setPhotos(photos: Photo[]) {
        this.photos = photos
    }

    appendPhotosForUpload(files: File[]) {
        this.photosForUpload.push(...files)
    }

    setPhotosForUpload(files: File[]){
        this.photosForUpload = files
    }

    removePhotoUpload(index: number) {
        this.photosForUpload = this.photosForUpload.filter((_, ind) => ind !== index)
    }

    async getPhotos() {
        try {
            const photos = await PhotoService.getPhotos();
            this.setPhotos(photos.data)
        } catch (err: unknown) {
            console.log("getPhotos err: ", err);
            if (err instanceof AxiosError) {
                toast(err?.response?.data.message, { className: "bg-red-600 text-white", hideProgressBar: true })
            }
            if (err instanceof String) {
                console.log(err);

                toast(err)
            }
        }
    }

    async createPhoto(file: PhotoCreate) {
        try {
            console.log(file);
            const formData = new FormData()
            formData.append("file", file.file)
            formData.append("name", file.name)
            const createdPhoto = await PhotoService.createPhoto(formData)
            this.setPhotos([createdPhoto.data, ...this.photos || []])
        } catch (e) {
            console.log("create photo errir", e);
            if (e instanceof AxiosError) {
                toast(e?.response?.data?.message, { className: "bg-red-600 text-white", hideProgressBar: true })
            }
        }
    }

    constructor() {
        makeAutoObservable(this);
    }
}