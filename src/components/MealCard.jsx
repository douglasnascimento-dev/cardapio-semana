import { Box, Card, CardActionArea, Typography } from '@mui/material'
import { areaLabel, categoryLabel } from '../utils/labels'
import FavoriteButton from './FavoriteButton'

export default function MealCard({ meal, onClick }) {
  const details = [
    meal.category && categoryLabel(meal.category),
    meal.area && areaLabel(meal.area),
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <Card
      sx={{
        position: 'relative',
        bgcolor: 'transparent',
        border: 'none',
        borderRadius: 0,
        '&:hover img': { transform: 'scale(1.04)' },
      }}
    >
      {/* Fora do CardActionArea: um botão não pode ficar dentro de outro */}
      <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 1 }}>
        <FavoriteButton meal={meal} />
      </Box>

      <CardActionArea
        onClick={onClick}
        disableRipple
        sx={{ '& .MuiCardActionArea-focusHighlight': { display: 'none' } }}
      >
        <Box sx={{ overflow: 'hidden', borderRadius: 3, aspectRatio: '4 / 3', bgcolor: 'divider' }}>
          <Box
            component="img"
            src={`${meal.thumb}/medium`}
            alt={meal.name}
            loading="lazy"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              transition: 'transform 0.5s ease',
            }}
          />
        </Box>

        <Box sx={{ pt: 1.75 }}>
          {details && (
            <Typography variant="overline" color="text.secondary" sx={{ fontSize: 11, lineHeight: 1.6 }}>
              {details}
            </Typography>
          )}
          <Typography variant="h6" component="h3" sx={{ fontSize: 19, lineHeight: 1.3 }}>
            {meal.name}
          </Typography>
        </Box>
      </CardActionArea>
    </Card>
  )
}
