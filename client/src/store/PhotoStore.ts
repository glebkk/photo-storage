import { AxiosError } from "axios";
import { makeAutoObservable } from "mobx";
import { toast } from "react-toastify";
import { PhotoService } from "../api/PhotoService";
import { toastError, toastErrorUpdate, toastSettings, toastSuccessUpdate } from "../utils/toast";
import { RootStore } from "./store";

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
                toastError(e?.response?.data?.message)
            }
            if (e instanceof String) {
                console.log(e);
                toast(e)
            }
        }
    }

    async createPhoto(file: PhotoCreate) {
        const toastId = toast.loading("Загрузка", toastSettings)

        try {
            const formData = new FormData()
            formData.append("file", file.file)
            formData.append("name", file.name)
            const createdPhoto = await PhotoService.createPhoto(formData)
            this.setPhotos([createdPhoto.data, ...this.photos])
            toastSuccessUpdate(toastId, "Фото успешно загружено")
        } catch (e) {
            console.log("create photo errir", e);
            if (e instanceof AxiosError) {
                toastErrorUpdate(toastId, e?.response?.data?.message)
            }
        }
    }

    async deletePhoto(photo: Photo) {
        const toastId = toast.loading("Загрузка", toastSettings)
        try {
            const resp = await PhotoService.deletePhoto(photo.name)
            console.log(resp);
            this.setPhotos(this.photos.filter(ph => ph.name != photo.name))
            this.rootStore.albumsStore.removePhotoFromAlbums(photo.id)
            toastSuccessUpdate(toastId, "Фото удалено")
        } catch (e) {
            console.log("create delet errir", e);
            if (e instanceof AxiosError) {
                toastErrorUpdate(toastId, e?.response?.data?.message)
            }
        }
    }

    constructor(private rootStore: RootStore) {
        makeAutoObservable(this);
    }
}