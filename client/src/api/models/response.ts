import { Album } from "./Album"
import { User } from "./User"

export type AuthReponse = {
    access_token: string,
    refresh_token: string,
    user: User
}

export type UpdatePasswordResponse = {
    message: string
}

export type AlbumsResponse = Album[]