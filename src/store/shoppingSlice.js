import { createSlice } from '@reduxjs/toolkit'

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
