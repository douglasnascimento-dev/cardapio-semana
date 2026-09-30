import { useEffect, useState } from 'react'
import { getCategories, listIngredients } from '../api/mealdb'

// Guardado fora do componente: ao trocar de aba a página Explorar é
// desmontada, e assim as listas não são buscadas de novo ao voltar.
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
        // Sem as listas os filtros ficam vazios, mas a busca continua funcionando
        if (err.name !== 'AbortError') console.error(err)
      })

    return () => controller.abort()
  }, [])

  return options
}
