import { useEffect, useState } from 'react'
import { getMealById } from '../api/mealdb'

export default function useMealDetails(id) {
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState({ key: null, meal: null, error: null })

  const key = id ? `${id}:${attempt}` : null

  useEffect(() => {
    if (!id) return

    const controller = new AbortController()

    getMealById(id, { signal: controller.signal })
      .then((meal) =>
        setResult({ key, meal, error: meal ? null : 'Receita não encontrada.' }),
      )
      .catch((err) => {
        if (err.name === 'AbortError') return
        setResult({ key, meal: null, error: err.message })
      })

    return () => controller.abort()
  }, [key, id])

  let status = 'idle'
  if (id) {
    if (result.key !== key) status = 'loading'
    else if (result.error) status = 'error'
    else status = 'success'
  }

  const retry = () => setAttempt((n) => n + 1)

  return {
    meal: result.key === key ? result.meal : null,
    status,
    error: result.error,
    retry,
  }
}
