import { AuthStore } from "./AuthStore";
import { PhotoStore } from "./PhotoStore";


export class RootStore {
    authStore: AuthStore
    photoStore: PhotoStore

    constructor() {
        this.authStore = new AuthStore()
        this.photoStore = new PhotoStore()
    }
}
