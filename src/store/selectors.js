import { createSelector } from '@reduxjs/toolkit'
import { DAYS, SLOTS } from '../utils/week'

const selectFavoriteIds = (state) => state.favorites.ids
const selectMealsById = (state) => state.meals.byId
const selectPlanDays = (state) => state.plan.days
const selectChecked = (state) => state.shopping.checked

export const selectFavoritesCount = (state) => state.favorites.ids.length

export const selectIsFavorite = (state, id) => state.favorites.ids.includes(id)

export const selectFavoriteMeals = createSelector(
  [selectFavoriteIds, selectMealsById],
  (ids, byId) => ids.map((id) => byId[id]).filter(Boolean),
)

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

const selectPlannedIds = createSelector([selectPlanDays], (days) =>
  DAYS.flatMap((day) => SLOTS.map((slot) => days[day.id][slot.id]).filter(Boolean)),
)

export const selectMissingMealIds = createSelector(
  [selectPlannedIds, selectMealsById],
  (ids, byId) => [...new Set(ids)].filter((id) => !byId[id]?.ingredients),
)

export const selectPlannedMeals = createSelector(
  [selectPlannedIds, selectMealsById],
  (ids, byId) => {
    const counts = new Map()
    ids.forEach((id) => counts.set(id, (counts.get(id) ?? 0) + 1))
    return [...counts].map(([id, count]) => ({ id, count, meal: byId[id] ?? null }))
  },
)

function summarizeMeasures(measures) {
  const counts = new Map()
  measures.forEach((m) => counts.set(m, (counts.get(m) ?? 0) + 1))
  return [...counts].map(([m, n]) => (n > 1 ? `${n} × ${m}` : m)).join(' + ')
}

export const selectShoppingList = createSelector(
  [selectPlannedIds, selectMealsById, selectChecked],
  (ids, byId, checked) => {
    const items = new Map()

    ids.forEach((id) => {
      const meal = byId[id]
      if (!meal?.ingredients) return

      meal.ingredients.forEach(({ name, measure }) => {
        const key = name.trim().toLowerCase()
        if (!items.has(key)) {
          items.set(key, { key, name, measures: [], meals: new Map() })
        }
        const item = items.get(key)
        if (measure) item.measures.push(measure)
        item.meals.set(meal.id, meal.name)
      })
    })

    const list = [...items.values()].map((item) => ({
      key: item.key,
      name: item.name,
      quantity: summarizeMeasures(item.measures),
      meals: [...item.meals.values()],
      checked: Boolean(checked[item.key]),
    }))

    list.sort((a, b) => a.checked - b.checked || a.name.localeCompare(b.name))

    return {
      items: list,
      total: list.length,
      checkedCount: list.filter((item) => item.checked).length,
    }
  },
)

export const selectRemainingCount = createSelector(
  [selectShoppingList],
  (list) => list.total - list.checkedCount,
)
