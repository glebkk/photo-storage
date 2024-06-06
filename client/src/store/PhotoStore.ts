import { AxiosError } from "axios";
import { makeAutoObservable } from "mobx";
import { toast } from "react-toastify";
import { PhotoService } from "../api/PhotoService";

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
            const formData = new FormData()
            formData.append("file", file.file)
            formData.append("name", file.name)
            const createdPhoto = await PhotoService.createPhoto(formData)

            this.photos.push(createdPhoto.data)
            toast("Фото успешно загружено", { className: "bg-green-600 text-white", hideProgressBar: true })
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