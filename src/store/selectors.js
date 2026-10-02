import { createSelector } from '@reduxjs/toolkit'

const selectFavoriteIds = (state) => state.favorites.ids
const selectMealsById = (state) => state.meals.byId

export const selectFavoritesCount = (state) => state.favorites.ids.length

export const selectIsFavorite = (state, id) => state.favorites.ids.includes(id)

// createSelector memoriza o resultado: a lista só é recalculada quando
// os ids ou o cache de receitas mudam, e não a cada render.
export const selectFavoriteMeals = createSelector(
  [selectFavoriteIds, selectMealsById],
  (ids, byId) => ids.map((id) => byId[id]).filter(Boolean),
)
