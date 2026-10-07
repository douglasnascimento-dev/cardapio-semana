import { configureStore } from '@reduxjs/toolkit'
import favoritesReducer from './favoritesSlice'
import mealsReducer from './mealsSlice'
import planReducer from './planSlice'
import shoppingReducer from './shoppingSlice'

const STORAGE_KEY = 'cardapio-semana:v1'

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (!saved) return undefined
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
    return true
  } catch {
    return false
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

let saveTimer = null
store.subscribe(() => {
  clearTimeout(saveTimer)
  saveTimer = setTimeout(() => saveState(store.getState()), 500)
})
