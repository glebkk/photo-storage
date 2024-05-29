import { createContext } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './assets/index.css'
import { ThemeProvider } from './context/ThemeContext.tsx'
import Store from './store/store.ts'

interface StoreState {
  store: Store
}

const store = new Store()

export const StoreContext = createContext<StoreState>({
  store,
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StoreContext.Provider value={{ store }}>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StoreContext.Provider>
)
