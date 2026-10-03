import { createSlice } from '@reduxjs/toolkit'
import { toggleFavorite } from './favoritesSlice'
import { setMeal } from './planSlice'

// Junta os dados novos com os que já existem, sem apagar o que já se sabe.
// Ex.: um resultado de filtro não tem ingredientes, e isso não pode
// sobrescrever uma receita completa que já está guardada.
function mergeMeal(byId, meal) {
  const current = byId[meal.id] ?? {}
  const known = Object.fromEntries(
    Object.entries(meal).filter(([, value]) => value !== null && value !== undefined),
  )
  byId[meal.id] = { ...current, ...known }
}

// "Banco" local de receitas, indexado por id: { byId: { '52771': {...} } }
const mealsSlice = createSlice({
  name: 'meals',
  initialState: { byId: {} },
  reducers: {
    cacheMeal(state, action) {
      mergeMeal(state.byId, action.payload)
    },
  },
  // Um mesmo action pode ser tratado por vários slices: ao favoritar ou
  // planejar, o outro slice guarda o id e este guarda os dados da receita.
  extraReducers: (builder) => {
    builder
      .addCase(toggleFavorite, (state, action) => {
        mergeMeal(state.byId, action.payload)
      })
      .addCase(setMeal, (state, action) => {
        mergeMeal(state.byId, action.payload.meal)
      })
  },
})

export const { cacheMeal } = mealsSlice.actions
export default mealsSlice.reducer
