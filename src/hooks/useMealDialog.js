import { useState } from 'react'

export default function useMealDialog() {
  const [selectedMeal, setSelectedMeal] = useState(null)
  const [open, setOpen] = useState(false)

  const openDetails = (meal) => {
    setSelectedMeal(meal)
    setOpen(true)
  }

  const close = () => setOpen(false)

  return { selectedMeal, open, openDetails, close }
}
