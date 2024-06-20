import { observer } from 'mobx-react-lite';
import { useContext, useEffect, useState } from 'react';
import { IoIosArrowBack, IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { API_URL } from '../axios/axios';
import { Image } from '../components/Images/Image';
import { StoreContext } from '../main';
import { Album } from '../api/models/Album';

export const AlbumPage = observer(() => {
    const { albumId } = useParams<{ albumId: string }>();
    const { albumsStore, photoStore } = useContext(StoreContext).store

    const [appendPhotos, setAppendPhotos] = useState(false)
    const [selectedPhotos, setSelectedPhotos] = useState([] as Photo[]);
    const [photosForAppend, setPhotosForAppend] = useState([] as Photo[]);
    const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>([])

    const [album, setAlbum] = useState<Album>()
    const navigate = useNavigate()

    useEffect(() => {
        if (albumId) {
            const album = albumsStore.getById(+albumId!)
            if (album) {

                setAlbum(album)
                if (photoStore.photos) {
                    const photos = photoStore.photos.filter(photo => !JSON.stringify(album.photos).includes(JSON.stringify(photo)))
                    setPhotosForAppend(photos)
                    setFilteredPhotos(photos)
                }
            }
            else
                navigate("/albums")
        }
    }, [albumsStore.albums])

    function toggleAppendPhotos() {
        setAppendPhotos(prev => !prev)
    }

    function handlePhotoClick(photo: Photo) {
        if (selectedPhotos.includes(photo)) {
            setSelectedPhotos(selectedPhotos.filter((p) => p.id !== photo.id));
        } else {
            setSelectedPhotos([...selectedPhotos, photo]);
        }
    };

    function appendToAlbum() {
        if (selectedPhotos && album) {
            selectedPhotos.forEach((photo) => {
                albumsStore.uploadPhotoToAlbum(photo, album.id)
            })
        }
        setSelectedPhotos([])
        setAppendPhotos(false)
    }

    function deleteAlbum() {
        albumsStore.deleteAlbum(+albumId!!)
    }

    if (!album) {
        return
    }

    return (
        <>
            <ToastContainer />
            <div className='flex flex-col gap-2'>
                <div className='flex items-center gap-4'>
                    <Link to={'/albums'}><IoIosArrowBack /></Link>
                    <h1 className='text-lg'>Альбом - {album.name}</h1>
                </div>
                <div className="flex flex-col border-y-2 border-white/20 p-2 gap-4">
                    <div className='flex gap-2'>

                        <button className='self-start flex gap-2 justify-between items-center' onClick={toggleAppendPhotos}>Добавить фото
                            {appendPhotos
                                ? <IoIosArrowUp />
                                : <IoIosArrowDown />
                            }
                        </button>
                        <button className='bg-red-500 text-white' onClick={deleteAlbum}>Удалить альбом</button>
                    </div>

                    {appendPhotos &&
                        <div className='bg-gray-300 dark:bg-zinc-900 p-4 rounded-lg'>
                            {!photosForAppend || photosForAppend.length === 0
                                ?
                                <div className='w-full flex justify-between'>
                                    <p>У вас нет фотографий для добавления в альбом</p>
                                    <Link to={"/"}>Загрузить новые фото?</Link>
                                </div>
                                :
                                <div className='flex flex-col gap-2'>
                                    <input onChange={(e) => {
                                        setFilteredPhotos(photosForAppend.filter(val => val.name.includes(e.target.value)))
                                    }} type="text" placeholder='Поиск' />
                                    <div className='gap-2 grid grid-cols-6 max-h-96 overflow-auto'>
                                        {filteredPhotos.map((photo) => (
                                            <div
                                                key={photo.id}
                                                className={`relative w-full cursor-pointer aspect-square rounded-lg overflow-hidden border-4 ${selectedPhotos.includes(photo) ? 'border-green-500' : 'border-transparent'}`}
                                                onClick={() => handlePhotoClick(photo)}
                                            >
                                                <img className="w-full h-full object-cover" src={`${API_URL}/${photoStore.staticPath}${photo.userId}/${photo.filePath}`} alt={photo.filePath} />
                                                <div className='absolute bottom-0 text-sm text-center p-2 right-0 w-full bg-black/60'>
                                                    <p className='truncate text-white'>{photo.name}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button className='bg-green-500 text-white self-end' onClick={appendToAlbum}>Добавить</button>
                                </div>
                            }
                        </div>
                    }
                </div>

                {album.photos && album.photos.length !== 0 ?
                    <div className="w-full grid grid-cols-2 gap-4 md:grid-cols-6">
                        {album.photos.map(photo => (
                            <div key={photo.id} className='relative rounded-lg overflow-hidden'>
                                <Image photo={photo} menuItems={[{ label: "Удалить из альбома", action: () => { albumsStore.deletePhotoFromAlbum(photo.id, album.id) } }]} />
                            </div>
                        ))}
                    </div> :
                    <div>
                        В альбоме нет фотографий
                    </div>
                }
            </div>
        </>
    )
})