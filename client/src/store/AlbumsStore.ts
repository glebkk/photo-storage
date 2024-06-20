import { AxiosError } from "axios";
import { makeAutoObservable } from "mobx";
import { toast } from "react-toastify";
import { AlbumService } from "../api/AlbumService";
import { Album } from "../api/models/Album";
import { toastError, toastErrorUpdate, toastSettings, toastSuccessUpdate } from "../utils/toast";

export class AlbumStore {
    albums: Album[] = []
    staticPath = "public/"

    setAlbums(albums: Album[]) {
        this.albums = albums
    }

    appendPhotoToAlbum(albumId: number, photo: Photo) {
        this.albums = this.albums.map(album => {
            if (album.id === albumId) {
                if (!album.photos) album.photos = []
                return { ...album, photos: [...album.photos, photo] }
            }
            return album
        })
    }

    removePhotoFromAlbum(photoId: number, albumId: number): void {
        const album = this.albums.find(a => a.id === albumId);
        if (!album) {
            return;
        }

        album.photos = album.photos.filter(p => p.id !== photoId);
    }

    removePhotoFromAlbums(photoId: number) {
        if (this.albums)
            this.albums.forEach(album => {
                album.photos = album.photos.filter(photo => photo.id !== photoId);
            });
    }

    getById(albumId: number) {
        return this.albums.find(al => al.id === albumId)
    }

    async getAlbums() {
        try {
            const albums = await AlbumService.getAlbums();
            this.setAlbums(albums.data)
        } catch (e: unknown) {
            console.log("getAlbums err: ", e);
            if (e instanceof AxiosError) {
                toastError(e?.response?.data?.message)
            }
            if (e instanceof String) {
                console.log(e);
                toast(e)
            }
        }
    }

    async createAlbum(name: string) {
        const toastId = toast.loading("Создание альбома...", toastSettings)
        try {
            const newAlb = await AlbumService.createAlbum(name)
            this.setAlbums([...this.albums, newAlb.data])
            toastSuccessUpdate(toastId, "Альбом успешно создан")
        } catch (e) {
            console.log("create photo errir", e);
            if (e instanceof AxiosError) {
                toastErrorUpdate(toastId, "Ошибка")
            }
            toast.update(toastId, { isLoading: false })
        }
        console.log(toastId.toString());
    }

    async deleteAlbum(albumId: number) {
        const toastId = toast.loading("Загрузка", toastSettings)
        try {
            const resp = await AlbumService.deleteAlbum(albumId)
            console.log(resp);
            this.setAlbums(this.albums.filter(album => album.id != albumId))
            toastSuccessUpdate(toastId, "Альбом удален")
        } catch (e) {
            console.log("create delet errir", e);
            if (e instanceof AxiosError) {
                toastErrorUpdate(toastId, e?.response?.data?.message)
            }
        }
    }

    async uploadPhotoToAlbum(photo: Photo, albumId: number) {
        const toastId = toast.loading("Добавление фото...", toastSettings)
        try {
            await AlbumService.appendPhotoToAlbum(photo.id, albumId)
            this.appendPhotoToAlbum(albumId, photo)
            toastSuccessUpdate(toastId, "Фото успешно загружено")
        } catch (e) {
            console.log("create photo errir", e);
            if (e instanceof AxiosError) {
                toastErrorUpdate(toastId, "Ошибка")
            }
            toast.update(toastId, { isLoading: false })
        }
        console.log(toastId.toString());

    }

    async deletePhotoFromAlbum(photoId: number, albumId: number) {
        const toastId = toast.loading("Загрузка", toastSettings)
        try {
            await AlbumService.deletePhotoFromAlbum(photoId, albumId)
            this.removePhotoFromAlbum(photoId, albumId)
            toastSuccessUpdate(toastId, "Фото удалено из альбома")
        } catch (e) {
            console.log("create photo errir", e);
            if (e instanceof AxiosError) {
                toastErrorUpdate(toastId, "Ошибка")
            }
        }
    }

    constructor() {
        makeAutoObservable(this);
    }
}