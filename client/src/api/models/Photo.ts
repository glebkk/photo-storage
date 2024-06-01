type Photo = {
    id: number,
    userId: number,
    filePath: string,
    name: string
}

type PhotoCreate = {
    file: File,
    name: string
}