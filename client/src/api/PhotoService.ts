import { AxiosResponse } from "axios";
import { instance } from "../axios/axios";
import { PhotosResponse } from "./models/response";

export class PhotoService {
    static async getPhotos(): Promise<AxiosResponse<PhotosResponse>> {
        return instance.get<PhotosResponse>("/photo/")
    }

    static async createPhoto(file: FormData): Promise<AxiosResponse<Photo>> {
        return instance.post<Photo>("/photo/", file)
    }
}