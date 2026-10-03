import { useState } from 'react'

// Controle da janela de detalhes, compartilhado entre as páginas.
// A receita continua guardada depois de fechar, para o conteúdo não
// sumir durante a animação de saída.
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
