import { Button, IconButton } from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { useDispatch, useSelector } from 'react-redux'
import { toggleFavorite } from '../store/favoritesSlice'
import { selectIsFavorite } from '../store/selectors'

// variant "icon": coração redondo sobre a foto do card
// variant "button": botão com texto, usado na janela de detalhes
export default function FavoriteButton({ meal, variant = 'icon' }) {
  const dispatch = useDispatch()
  const isFavorite = useSelector((state) => selectIsFavorite(state, meal.id))

  const handleClick = (event) => {
    event.stopPropagation()
    dispatch(toggleFavorite(meal))
  }

  const icon = isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />
  const label = isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'

  if (variant === 'button') {
    return (
      <Button
        onClick={handleClick}
        variant={isFavorite ? 'contained' : 'outlined'}
        color={isFavorite ? 'secondary' : 'inherit'}
        startIcon={icon}
        aria-pressed={isFavorite}
      >
        {isFavorite ? 'Nos favoritos' : 'Favoritar'}
      </Button>
    )
  }

  return (
    <IconButton
      onClick={handleClick}
      aria-label={label}
      aria-pressed={isFavorite}
      size="small"
      sx={{
        bgcolor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(8px)',
        color: isFavorite ? 'secondary.main' : 'text.primary',
        '&:hover': { bgcolor: 'background.paper' },
        '& svg': { fontSize: 20 },
      }}
    >
      {icon}
    </IconButton>
  )
}
