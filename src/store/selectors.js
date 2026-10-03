import { createSelector } from '@reduxjs/toolkit'
import { DAYS, SLOTS } from '../utils/week'

const selectFavoriteIds = (state) => state.favorites.ids
const selectMealsById = (state) => state.meals.byId
const selectPlanDays = (state) => state.plan.days

export const selectFavoritesCount = (state) => state.favorites.ids.length

export const selectIsFavorite = (state, id) => state.favorites.ids.includes(id)

// createSelector memoriza o resultado: a lista só é recalculada quando
// os ids ou o cache de receitas mudam, e não a cada render.
export const selectFavoriteMeals = createSelector(
  [selectFavoriteIds, selectMealsById],
  (ids, byId) => ids.map((id) => byId[id]).filter(Boolean),
)

// A semana pronta para exibir: troca os ids pelos dados das receitas.
// [{ id: 'mon', label: 'Segunda', slots: [{ id: 'lunch', label, meal }] }]
export const selectWeek = createSelector([selectPlanDays, selectMealsById], (days, byId) =>
  DAYS.map((day) => ({
    ...day,
    slots: SLOTS.map((slot) => ({
      ...slot,
      meal: byId[days[day.id][slot.id]] ?? null,
    })),
  })),
)

export const selectPlannedCount = createSelector([selectPlanDays], (days) =>
  Object.values(days).reduce(
    (total, slots) => total + Object.values(slots).filter(Boolean).length,
    0,
  ),
)
