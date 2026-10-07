import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getMealById } from '../api/mealdb'
import { toggleFavorite } from './favoritesSlice'
import { setMeal } from './planSlice'

function mergeMeal(byId, meal) {
  const current = byId[meal.id] ?? {}
  const known = Object.fromEntries(
    Object.entries(meal).filter(([, value]) => value !== null && value !== undefined),
  )
  byId[meal.id] = { ...current, ...known }
}

export const fetchMealById = createAsyncThunk(
  'meals/fetchById',
  async (id) => {
    const meal = await getMealById(id)
    if (!meal) throw new Error('Receita não encontrada.')
    return meal
  },
  {
    condition: (id, { getState }) => {
      const { meals } = getState()
      if (meals.byId[id]?.ingredients) return false
      if (meals.requests[id] === 'loading') return false
    },
  },
)

const mealsSlice = createSlice({
  name: 'meals',
  initialState: { byId: {}, requests: {} },
  reducers: {
    cacheMeal(state, action) {
      mergeMeal(state.byId, action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(toggleFavorite, (state, action) => {
        mergeMeal(state.byId, action.payload)
      })
      .addCase(setMeal, (state, action) => {
        mergeMeal(state.byId, action.payload.meal)
      })
      .addCase(fetchMealById.pending, (state, action) => {
        state.requests[action.meta.arg] = 'loading'
      })
      .addCase(fetchMealById.fulfilled, (state, action) => {
        mergeMeal(state.byId, action.payload)
        delete state.requests[action.meta.arg]
      })
      .addCase(fetchMealById.rejected, (state, action) => {
        state.requests[action.meta.arg] = 'error'
      })
  },
})

export const { cacheMeal } = mealsSlice.actions
export default mealsSlice.reducer
