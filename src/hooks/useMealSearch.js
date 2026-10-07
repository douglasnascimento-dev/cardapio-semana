import { useEffect, useState } from 'react'
import { filterMeals, searchMealsByName } from '../api/mealdb'
import { sameArea } from '../utils/labels'

function matchesFilters(meal, { category, area, ingredient }) {
  if (category && meal.category !== category) return false
  if (area && !sameArea(meal.area, area)) return false
  if (
    ingredient &&
    !meal.ingredients.some((i) => i.name.toLowerCase() === ingredient.toLowerCase())
  ) {
    return false
  }
  return true
}

function fetchMeals({ query, category, area, ingredient }, signal) {
  const filters = { category, area, ingredient }
  const hasFilters = Boolean(category || area || ingredient)

  if (query) {
    return searchMealsByName(query, { signal }).then((meals) =>
      meals.filter((meal) => matchesFilters(meal, filters)),
    )
  }

  if (hasFilters) {
    return filterMeals(filters, { signal }).then((meals) =>
      meals.map((meal) => ({ ...meal, category: category || null, area: area || null })),
    )
  }

  return searchMealsByName('', { signal })
}

export default function useMealSearch({ query, category, area, ingredient }) {
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState({ key: null, meals: [], error: null })

  const key = JSON.stringify([query.trim(), category, area, ingredient, attempt])

  useEffect(() => {
    const controller = new AbortController()

    fetchMeals({ query: query.trim(), category, area, ingredient }, controller.signal)
      .then((meals) => setResult({ key, meals, error: null }))
      .catch((err) => {
        if (err.name === 'AbortError') return
        setResult({ key, meals: [], error: err.message })
      })

    return () => controller.abort()
  }, [key, query, category, area, ingredient])

  let status = 'success'
  if (result.key !== key) status = 'loading'
  else if (result.error) status = 'error'

  const retry = () => setAttempt((n) => n + 1)

  return { meals: result.meals, status, error: result.error, retry }
}
