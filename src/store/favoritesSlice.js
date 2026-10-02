import { createSlice } from '@reduxjs/toolkit'

// Guarda só os IDs. Os dados das receitas ficam no mealsSlice
// (estado normalizado, sem duplicar informação).
const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: { ids: [] },
  reducers: {
    // payload: a receita inteira (ao menos id, nome e foto). O mealsSlice
    // também escuta esta action para guardar os dados da receita.
    toggleFavorite(state, action) {
      const { id } = action.payload
      // O Redux Toolkit usa Immer, então dá para "mutar" o state aqui
      if (state.ids.includes(id)) {
        state.ids = state.ids.filter((favId) => favId !== id)
      } else {
        state.ids.unshift(id)
      }
    },
  },
})

export const { toggleFavorite } = favoritesSlice.actions
export default favoritesSlice.reducer
