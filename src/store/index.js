import { configureStore } from '@reduxjs/toolkit'
import favoritesReducer from './favoritesSlice'
import mealsReducer from './mealsSlice'
import planReducer from './planSlice'

const STORAGE_KEY = 'cardapio-semana:v1'

// O localStorage pode estar indisponível (aba anônima, bloqueio do
// navegador) ou com dados corrompidos. Nesses casos o app começa vazio.
function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : undefined
  } catch {
    return undefined
  }
}

function saveState(state) {
  try {
    const { favorites, meals, plan } = state
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ favorites, meals, plan }))
  } catch {
    // sem espaço ou sem permissão: segue sem salvar
  }
}

export const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
    meals: mealsReducer,
    plan: planReducer,
  },
  preloadedState: loadState(),
})

// Salva a cada mudança, mas no máximo uma vez a cada 500 ms
let saveTimer = null
store.subscribe(() => {
  clearTimeout(saveTimer)
  saveTimer = setTimeout(() => saveState(store.getState()), 500)
})
