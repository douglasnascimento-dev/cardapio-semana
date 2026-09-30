import { useEffect, useState } from 'react'
import { filterMeals, searchMealsByName } from '../api/mealdb'
import { sameArea } from '../utils/labels'

// A busca por nome já traz a receita completa (categoria, origem e
// ingredientes), então os filtros podem ser aplicados aqui mesmo.
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

  // 1) Texto digitado: busca por nome e filtra o resultado no cliente
  if (query) {
    return searchMealsByName(query, { signal }).then((meals) =>
      meals.filter((meal) => matchesFilters(meal, filters)),
    )
  }

  // 2) Só filtros: filter.php (com interseção quando há mais de um).
  //    Esse endpoint não devolve categoria/origem, mas sabemos quais são
  //    pelos próprios filtros, então completamos para exibir no card.
  if (hasFilters) {
    return filterMeals(filters, { signal }).then((meals) =>
      meals.map((meal) => ({ ...meal, category: category || null, area: area || null })),
    )
  }

  // 3) Nada selecionado: a busca vazia devolve uma seleção de receitas
  return searchMealsByName('', { signal })
}

// status: 'loading' | 'success' | 'error'
export default function useMealSearch({ query, category, area, ingredient }) {
  const [attempt, setAttempt] = useState(0)
  // Cada resposta é guardada junto com a "chave" da busca que a gerou.
  // Se a chave atual for diferente, a resposta é de uma busca anterior,
  // ou seja, a nova ainda está carregando. Assim não é preciso chamar
  // setStatus('loading') dentro do effect.
  const [result, setResult] = useState({ key: null, meals: [], error: null })

  const key = JSON.stringify([query.trim(), category, area, ingredient, attempt])

  useEffect(() => {
    // Se a busca mudar antes da resposta chegar, a requisição anterior é
    // cancelada no cleanup. Assim uma resposta antiga nunca sobrescreve
    // uma mais nova.
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
