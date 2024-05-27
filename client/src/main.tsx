import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './assets/index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Root } from './routes/root.tsx'
import { ErrorPage } from './routes/error-page.tsx'
import { LoginPage } from './pages/LoginPage.tsx'
import { RegisterPage } from './pages/RegisterPage.tsx'
import { ThemeProvider } from './context/ThemeContext.tsx'
import { PrivateRoute } from './routes/PrivateRoute.tsx'
import { AuthProvider } from './context/AuthContext.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element:
        <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <App />
      }
    ]
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/register",
    element: <RegisterPage />
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
