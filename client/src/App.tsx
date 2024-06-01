import { observer } from "mobx-react-lite"
import { useContext, useEffect } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { StoreContext } from "./main"
import { GalleryPage } from "./pages/GalleryPage"
import { LoaderPage } from "./pages/LoaderPage"
import LoginPage from "./pages/LoginPage"
import { RegisterPage } from "./pages/RegisterPage"
import PrivateRoute from "./routes/PrivateRoute"
import { Root } from "./routes/root"

function App() {
  const { store: { authStore } } = useContext(StoreContext)

  useEffect(() => {
    (async () => {
      await authStore.checkAuth()
    })()
  }, [])

  if (authStore.isLoading) {
    return <LoaderPage />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <PrivateRoute isAuth={authStore.isAuth}>
            <Root />
          </PrivateRoute>
        }>
          <Route path="/" element={<GalleryPage />} />

        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="*" element={<div>404... not found </div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default observer(App)