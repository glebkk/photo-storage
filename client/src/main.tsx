import { createContext } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App.tsx'
import './assets/index.css'
import { ThemeProvider } from './context/ThemeContext.tsx'
import { RootStore } from './store/store.ts'

interface StoreState {
  store: RootStore
}

const store = new RootStore()

export const StoreContext = createContext<StoreState>({
  store,
})

ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
      <StoreContext.Provider value={{ store }}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </StoreContext.Provider>
    </BrowserRouter>
)
