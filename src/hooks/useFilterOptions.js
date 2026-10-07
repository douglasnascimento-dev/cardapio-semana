import { useEffect, useState } from 'react'
import { getCategories, listIngredients } from '../api/mealdb'

let cache = null

export default function useFilterOptions() {
  const [options, setOptions] = useState(cache ?? { categories: [], ingredients: [] })

  useEffect(() => {
    if (cache) return

    const controller = new AbortController()
    const { signal } = controller

    Promise.all([getCategories({ signal }), listIngredients({ signal })])
      .then(([categories, ingredients]) => {
        cache = {
          categories: categories.map((c) => c.name),
          ingredients: ingredients.sort((a, b) => a.localeCompare(b)),
        }
        setOptions(cache)
      })
      .catch((err) => {
        if (err.name !== 'AbortError') console.error(err)
      })

    return () => controller.abort()
  }, [])

  return options
}
