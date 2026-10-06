import { createSlice } from '@reduxjs/toolkit'

// A lista de compras em si NÃO fica aqui: ela é calculada a partir do
// plano (ver selectShoppingList). Este slice guarda só o que o usuário
// marcou como comprado, pela chave do ingrediente ("olive oil").
const shoppingSlice = createSlice({
  name: 'shopping',
  initialState: { checked: {} },
  reducers: {
    toggleChecked(state, action) {
      const key = action.payload
      if (state.checked[key]) {
        delete state.checked[key]
      } else {
        state.checked[key] = true
      }
    },
    clearChecked(state) {
      state.checked = {}
    },
  },
})

export const { toggleChecked, clearChecked } = shoppingSlice.actions
export default shoppingSlice.reducer
