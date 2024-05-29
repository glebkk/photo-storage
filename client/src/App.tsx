import { BrowserRouter, Routes, Route } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import { RegisterPage } from "./pages/RegisterPage"
import PrivateRoute from "./routes/PrivateRoute"
import { Root } from "./routes/root"
import { observer } from "mobx-react-lite"
import { useContext, useEffect } from "react"
import { StoreContext } from "./main"

function App() {
  const { store } = useContext(StoreContext)

  useEffect(() => {
    store.checkAuth()
  }, [])

  if (store.isLoading) {
    return "..."
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <PrivateRoute isAuth={store.isAuth}>
            <Root />
          </PrivateRoute>
        }>
          <Route path="/" element={<div>{store.isAuth ? store.user.login : "unauth"}</div>} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="*" element={<div>404... not found </div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default observer(App)
