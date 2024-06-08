import { AxiosError } from "axios";
import { makeAutoObservable } from "mobx";
import { toast } from "react-toastify";
import { PhotoService } from "../api/PhotoService";
import { errorToast, successToast } from "../utils/toast";

export class PhotoStore {
    photos: Photo[] = []
    photosForUpload: File[] = [];
    staticPath = "public/"


    setPhotos(photos: Photo[]) {
        this.photos = photos
    }

    appendPhotosForUpload(files: File[]) {
        this.photosForUpload.push(...files)
    }

    setPhotosForUpload(files: File[]) {
        this.photosForUpload = files
    }

    removePhotoUpload(index: number) {
        console.log(index);

        this.photosForUpload = this.photosForUpload.filter((_, ind) => ind !== index)
        console.log(this.photosForUpload);

    }

    async getPhotos() {
        try {
            const photos = await PhotoService.getPhotos();
            this.setPhotos(photos.data)
        } catch (e: unknown) {
            console.log("getPhotos err: ", e);
            if (e instanceof AxiosError) {
                errorToast(e?.response?.data?.message)

            }
            if (e instanceof String) {
                console.log(e);
                toast(e)
            }
        }
    }

    async createPhoto(file: PhotoCreate) {
        try {
            const formData = new FormData()
            formData.append("file", file.file)
            formData.append("name", file.name)
            const createdPhoto = await PhotoService.createPhoto(formData)

            this.photos.push(createdPhoto.data)
            successToast("Фото успешно загружено")
        } catch (e) {
            console.log("create photo errir", e);
            if (e instanceof AxiosError) {
                errorToast(e?.response?.data?.message)
            }
        }
    }

    async deletePhoto(name: string) {
        try {
            const resp = await PhotoService.deletePhoto(name)
            console.log(resp);
            this.photos = this.photos.filter(photo => photo.name != name)
            successToast("Фото удалено")
        } catch (e) {
            console.log("create photo errir", e);
            if (e instanceof AxiosError) {
                errorToast(e?.response?.data?.message)
            }
        }
    }

    constructor() {
        makeAutoObservable(this);
    }
}