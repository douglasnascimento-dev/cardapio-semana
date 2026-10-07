import { createSlice } from '@reduxjs/toolkit'
import { DAYS, SLOTS } from '../utils/week'

function emptyWeek() {
  return Object.fromEntries(
    DAYS.map((day) => [day.id, Object.fromEntries(SLOTS.map((slot) => [slot.id, null]))]),
  )
}

const planSlice = createSlice({
  name: 'plan',
  initialState: { days: emptyWeek() },
  reducers: {
    setMeal(state, action) {
      const { day, slot, meal } = action.payload
      state.days[day][slot] = meal.id
    },
    removeMeal(state, action) {
      const { day, slot } = action.payload
      state.days[day][slot] = null
    },
    clearWeek(state) {
      state.days = emptyWeek()
    },
  },
})

export const { setMeal, removeMeal, clearWeek } = planSlice.actions
export default planSlice.reducer
