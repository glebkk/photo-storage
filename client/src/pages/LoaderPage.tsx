import NinetyRingWithBg from '../components/Spinner'

export const LoaderPage = () => {
    return (
        <div className="h-screen w-full grid place-items-center">
            <NinetyRingWithBg height={100} width={100} color='fill-black dark:fill-white'/>
        </div>
    )
}