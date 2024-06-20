import { AlbumStore } from "./AlbumsStore";
import { AuthStore } from "./AuthStore";
import { PhotoStore } from "./PhotoStore";


export class RootStore {
    authStore: AuthStore
    photoStore: PhotoStore
    albumsStore: AlbumStore

    constructor() {
        this.authStore = new AuthStore()
        this.photoStore = new PhotoStore(this)
        this.albumsStore = new AlbumStore()
    }
}
