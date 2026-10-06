import { configureStore } from '@reduxjs/toolkit'
import favoritesReducer from './favoritesSlice'
import mealsReducer from './mealsSlice'
import planReducer from './planSlice'
import shoppingReducer from './shoppingSlice'

const STORAGE_KEY = 'cardapio-semana:v1'

// O localStorage pode estar indisponível (aba anônima, bloqueio do
// navegador) ou com dados corrompidos. Nesses casos o app começa vazio.
function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (!saved) return undefined
    // O andamento das buscas (requests) não é salvo: ao abrir o app de
    // novo, nada está carregando.
    return { ...saved, meals: { byId: saved.meals?.byId ?? {}, requests: {} } }
  } catch {
    return undefined
  }
}

function saveState(state) {
  try {
    const { favorites, meals, plan, shopping } = state
    const data = { favorites, meals: { byId: meals.byId }, plan, shopping }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // sem espaço ou sem permissão: segue sem salvar
  }
}

export const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
    meals: mealsReducer,
    plan: planReducer,
    shopping: shoppingReducer,
  },
  preloadedState: loadState(),
})

// Salva a cada mudança, mas no máximo uma vez a cada 500 ms
let saveTimer = null
store.subscribe(() => {
  clearTimeout(saveTimer)
  saveTimer = setTimeout(() => saveState(store.getState()), 500)
})
