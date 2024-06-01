import { User } from "./User"

export type AuthReponse = {
    access_token: string,
    refresh_token: string,
    user: User
}

export type PhotosResponse = Photo[]