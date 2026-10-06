import { useState } from 'react'
import { Box } from '@mui/material'
import { ingredientImage } from '../api/mealdb'

// Nem todo ingrediente tem foto na TheMealDB (ex.: "Coconut Oil").
// Quando a imagem falha, mostra um círculo neutro no lugar do ícone
// de imagem quebrada.
export default function IngredientImage({ name, size = 40 }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <Box
        aria-hidden
        sx={{
          width: size,
          height: size,
          flexShrink: 0,
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <Box sx={{ width: size * 0.5, height: size * 0.5, borderRadius: '50%', bgcolor: 'divider' }} />
      </Box>
    )
  }

  return (
    <Box
      component="img"
      src={ingredientImage(name)}
      alt=""
      loading="lazy"
      onError={() => setFailed(true)}
      sx={{ width: size, height: size, objectFit: 'contain', flexShrink: 0 }}
    />
  )
}
