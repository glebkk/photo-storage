import { observer } from "mobx-react-lite"
import { useContext, useState } from "react"
import { Link } from "react-router-dom"
import { Album } from "../api/models/Album"
import { StoreContext } from "../main"
import { CreateAlbumForm } from "../components/Forms/CreateAlbumForm"

export const AlbumsPage = observer(() => {
  const { albumsStore } = useContext(StoreContext).store
  const [createAlbum, setCreateAlbum] = useState(false)
  return (
    <div className="min-h-full flex flex-col gap-2 relative">
      <h1 className="text-lg">Альбомы</h1>
      <div className="flex flex-col border-y-2 border-white/20 p-2 gap-4">
        <button className='self-start flex gap-2 justify-between items-center' onClick={() => { setCreateAlbum(prev => !prev) }}>
          Создать
        </button>
        {createAlbum &&
          <div className='bg-gray-300 dark:bg-zinc-900 p-4 rounded-lg'>
            <CreateAlbumForm onSubmit={() => { setCreateAlbum(false) }} />
          </div>
        }
      </div>
      <AlbumsList albums={albumsStore.albums} />
    </div >
  )
})

type AlbumProps = {
  albums: Album[]
}

export function AlbumsList({ albums }: AlbumProps) {
  return (
    <>
      {!albums || albums.length === 0
        ? <p>Нет альбомов</p>
        : <div className="grid grid-cols-4 gap-4">
          {albums.map(album => (
            <Link key={album.id} to={`/albums/${album.id}`}>
              <div className="w-full aspect-square rounded-lg grid place-items-center bg-gray-300 dark:bg-zinc-900 cursor-pointer">
                {album.name}
              </div>
            </Link>
          ))}
        </div>
      }
    </>
  )
}