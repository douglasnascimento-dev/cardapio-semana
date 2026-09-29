import { useEffect, useState } from 'react'
import { searchMealsByName } from '../api/mealdb'

// Busca receitas por nome sempre que `query` muda.
// status: 'loading' | 'success' | 'error'
export default function useMealSearch(query) {
  const [meals, setMeals] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    // Se o usuário digitar de novo antes da resposta chegar, a requisição
    // anterior é cancelada no cleanup. Assim uma resposta antiga nunca
    // sobrescreve uma mais nova.
    const controller = new AbortController()

    setStatus('loading')
    setError(null)

    searchMealsByName(query.trim(), { signal: controller.signal })
      .then((result) => {
        setMeals(result)
        setStatus('success')
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        setError(err.message)
        setStatus('error')
      })

    return () => controller.abort()
  }, [query, attempt])

  const retry = () => setAttempt((n) => n + 1)

  return { meals, status, error, retry }
}
