type Photo = {
    id: number,
    userId: number,
    filePath: string,
    name: string,
    createdAt: string
}

type GroupedPhotos = {
    [key: string]: Photo[];
}

type PhotoCreate = {
    file: File,
    name: string
}