import { AxiosResponse } from "axios";
import { instance } from "../axios/axios";
import { Album } from "./models/Album";
import { AlbumsResponse } from "./models/response";

export class AlbumService {

    static async getAlbums(): Promise<AxiosResponse<AlbumsResponse>> {
        return instance.get<AlbumsResponse>("/album/")
    }

    static async appendPhotoToAlbum(photoId: number, albumId: number) {
        return instance.post("/album/photo", { photoId, albumId })
    }

    static async deleteAlbum(albumId: number) {
        return instance.delete(`/album/?id=${albumId}`)
    }

    static async createAlbum(name: string): Promise<AxiosResponse<Album>> {
        return instance.post("/album/", { name })
    }

    static async deletePhotoFromAlbum(photoId: number, albumId: number) {
        return instance.delete(`/album/photo?albumId=${albumId}&photoId=${photoId}`)
    }

}