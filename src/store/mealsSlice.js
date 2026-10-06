import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getMealById } from '../api/mealdb'
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

// Busca a receita completa na API (lookup.php). Usado pela lista de
// compras: receitas que vieram de um filtro não têm ingredientes.
export const fetchMealById = createAsyncThunk(
  'meals/fetchById',
  async (id) => {
    const meal = await getMealById(id)
    if (!meal) throw new Error('Receita não encontrada.')
    return meal
  },
  {
    // Evita requisições repetidas: não busca se já tem os ingredientes
    // ou se a mesma receita já está sendo carregada.
    condition: (id, { getState }) => {
      const { meals } = getState()
      if (meals.byId[id]?.ingredients) return false
      if (meals.requests[id] === 'loading') return false
    },
  },
)

// byId:     "banco" local de receitas, indexado por id
// requests: andamento das buscas, ex.: { '52771': 'loading' | 'error' }
const mealsSlice = createSlice({
  name: 'meals',
  initialState: { byId: {}, requests: {} },
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
      // As três etapas de um createAsyncThunk: pendente, ok e erro
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
