import { AxiosResponse } from "axios";
import { instance } from "../axios/axios";

export class PhotoService {
    static async getPhotos(): Promise<AxiosResponse<Photo[]>> {
        return instance.get<Photo[]>("/photo/")
    }

    static async createPhoto(file: FormData): Promise<AxiosResponse<Photo>> {
        return instance.post<Photo>("/photo/", file)
    }

    static async deletePhoto(name: string){
        instance.delete(`/photo?name=${name}`)
    }
}