import { observer } from "mobx-react-lite"
import { useContext, useEffect, useState } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { StoreContext } from "./main"
import { GalleryPage } from "./pages/GalleryPage"
import { LoaderPage } from "./pages/LoaderPage"
import LoginPage from "./pages/LoginPage"
import { RegisterPage } from "./pages/RegisterPage"
import PrivateRoute from "./routes/PrivateRoute"
import { Root } from "./routes/root"
import { UserSettingPage } from "./pages/UserSettingPage"
import { AlbumsPage } from "./pages/AlbumsPage"

function App() {
  const { store: { authStore } } = useContext(StoreContext)
  const [isAppReady, setIsAppReady] = useState(false)

  useEffect(() => {
    (async () => {
      authStore.checkAuth();
      setIsAppReady(true);
    })()
  }, [authStore]);

  if (authStore.isLoading || !isAppReady) {
    return <LoaderPage />;
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
          <Route path="settings" element={<UserSettingPage />} />
          <Route path="albums" element={<AlbumsPage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="*" element={<div>404... not found </div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default observer(App)