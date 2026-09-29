import { Box, Skeleton } from '@mui/material'
import MealCard from './MealCard'

const gridSx = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
  columnGap: 3,
  rowGap: 5,
}

export default function MealGrid({ meals, loading = false, onSelect }) {
  if (loading) {
    return (
      <Box sx={gridSx}>
        {Array.from({ length: 8 }, (_, i) => (
          <Box key={i}>
            <Skeleton variant="rounded" sx={{ aspectRatio: '4 / 3', height: 'auto', borderRadius: 3 }} />
            <Skeleton width="40%" sx={{ mt: 1.75 }} />
            <Skeleton width="80%" height={28} />
          </Box>
        ))}
      </Box>
    )
  }

  return (
    <Box sx={gridSx}>
      {meals.map((meal) => (
        <MealCard key={meal.id} meal={meal} onClick={onSelect ? () => onSelect(meal) : undefined} />
      ))}
    </Box>
  )
}
