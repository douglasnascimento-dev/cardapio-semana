import { createSelector } from '@reduxjs/toolkit'
import { DAYS, SLOTS } from '../utils/week'

const selectFavoriteIds = (state) => state.favorites.ids
const selectMealsById = (state) => state.meals.byId
const selectPlanDays = (state) => state.plan.days
const selectChecked = (state) => state.shopping.checked

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

// Todas as ocorrências do plano, na ordem da semana. A mesma receita pode
// aparecer mais de uma vez (ex.: almoço de segunda e jantar de quarta).
const selectPlannedIds = createSelector([selectPlanDays], (days) =>
  DAYS.flatMap((day) => SLOTS.map((slot) => days[day.id][slot.id]).filter(Boolean)),
)

// Receitas do plano que ainda não têm ingredientes no cache
// (vieram de um filtro). A página de compras busca essas na API.
export const selectMissingMealIds = createSelector(
  [selectPlannedIds, selectMealsById],
  (ids, byId) => [...new Set(ids)].filter((id) => !byId[id]?.ingredients),
)

// Receitas do plano sem repetição, com quantas vezes aparecem na semana
export const selectPlannedMeals = createSelector(
  [selectPlannedIds, selectMealsById],
  (ids, byId) => {
    const counts = new Map()
    ids.forEach((id) => counts.set(id, (counts.get(id) ?? 0) + 1))
    return [...counts].map(([id, count]) => ({ id, count, meal: byId[id] ?? null }))
  },
)

// "1 cup" + "1 cup" + "100g" vira "2 × 1 cup + 100g"
function summarizeMeasures(measures) {
  const counts = new Map()
  measures.forEach((m) => counts.set(m, (counts.get(m) ?? 0) + 1))
  return [...counts].map(([m, n]) => (n > 1 ? `${n} × ${m}` : m)).join(' + ')
}

// A lista de compras é DERIVADA do plano: não fica guardada em lugar
// nenhum. Se uma receita sai do plano, os ingredientes dela saem da lista
// sozinhos. Ingredientes repetidos são agrupados pelo nome (sem
// diferenciar maiúsculas). As medidas são texto livre na API ("1 cup",
// "200g", "pinch"), então não dá para somar: elas são listadas juntas.
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

    // Pendentes primeiro, depois ordem alfabética
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
