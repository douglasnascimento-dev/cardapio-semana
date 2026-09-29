import { useEffect, useState } from 'react'

// Devolve o valor só depois que ele parar de mudar por `delay` ms.
// Evita disparar uma requisição a cada tecla digitada.
export default function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
