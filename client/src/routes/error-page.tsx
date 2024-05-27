import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export function ErrorPage() {
    const error = useRouteError();
    return (
        <div className="h-screen w-screen grid place-items-center">
            {isRouteErrorResponse(error)
                ?
                <div>
                    <h1>Упс</h1>
                    <h2>{error.status}</h2>
                    <p>{error.statusText}</p>
                    {error.data?.message && <p>{error.data.message}</p>}
                </div>
                :
                <div>Упс</div>
            }
        </div>
    )
}