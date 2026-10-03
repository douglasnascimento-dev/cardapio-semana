import { Box, Button, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import { selectFavoriteMeals } from '../store/selectors'
import useMealDialog from '../hooks/useMealDialog'
import MealGrid from '../components/MealGrid'
import EmptyState from '../components/EmptyState'
import MealDetailsDialog from '../components/MealDetailsDialog'

export default function FavoritesPage({ onNavigate }) {
  const favorites = useSelector(selectFavoriteMeals)
  const dialog = useMealDialog()

  return (
    <Box>
      {favorites.length === 0 ? (
        <EmptyState
          title="Nenhum favorito ainda"
          description="Toque no coração de uma receita para guardá-la aqui."
          action={
            <Button variant="contained" onClick={() => onNavigate('explore')}>
              Explorar receitas
            </Button>
          }
        />
      ) : (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {favorites.length} {favorites.length === 1 ? 'receita salva' : 'receitas salvas'}
          </Typography>
          <MealGrid meals={favorites} onSelect={dialog.openDetails} />
        </>
      )}

      <MealDetailsDialog meal={dialog.selectedMeal} open={dialog.open} onClose={dialog.close} />
    </Box>
  )
}
