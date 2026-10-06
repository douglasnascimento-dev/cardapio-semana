import { useState } from 'react'
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  LinearProgress,
  Typography,
} from '@mui/material'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import { useDispatch, useSelector } from 'react-redux'
import { clearWeek, removeMeal, setMeal } from '../store/planSlice'
import { selectFavoriteMeals, selectPlannedCount, selectWeek } from '../store/selectors'
import { TOTAL_SLOTS, todayId } from '../utils/week'
import useMealDialog from '../hooks/useMealDialog'
import PlannerSlot from '../components/PlannerSlot'
import MealDetailsDialog from '../components/MealDetailsDialog'

export default function PlannerPage({ onNavigate }) {
  const dispatch = useDispatch()
  const week = useSelector(selectWeek)
  const plannedCount = useSelector(selectPlannedCount)
  const favorites = useSelector(selectFavoriteMeals)
  const dialog = useMealDialog()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const today = todayId()

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          mb: 4,
        }}
      >
        <Box sx={{ flex: '1 1 260px', maxWidth: 360 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {plannedCount} de {TOTAL_SLOTS} refeições planejadas
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(plannedCount / TOTAL_SLOTS) * 100}
            color="secondary"
            sx={{ height: 4, borderRadius: 2, bgcolor: 'divider' }}
          />
        </Box>
        {plannedCount > 0 && (
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<RestartAltIcon />}
            onClick={() => setConfirmOpen(true)}
          >
            Limpar semana
          </Button>
        )}
      </Box>

      <Box component="ol" sx={{ listStyle: 'none', p: 0, m: 0 }}>
        {week.map((day) => (
          <Box
            component="li"
            key={day.id}
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '180px 1fr 1fr' },
              alignItems: 'center',
              gap: 2,
              py: 2.5,
              borderTop: 1,
              borderColor: 'divider',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h5" component="h2" sx={{ fontSize: 24 }}>
                {day.label}
              </Typography>
              {day.id === today && (
                <Chip label="Hoje" size="small" color="secondary" sx={{ height: 22, fontSize: 12 }} />
              )}
            </Box>

            {day.slots.map((slot) => (
              <PlannerSlot
                key={slot.id}
                slot={slot}
                meal={slot.meal}
                favorites={favorites}
                onPick={(meal) => dispatch(setMeal({ day: day.id, slot: slot.id, meal }))}
                onRemove={() => dispatch(removeMeal({ day: day.id, slot: slot.id }))}
                onOpen={dialog.openDetails}
                onExplore={() => onNavigate('explore')}
              />
            ))}
          </Box>
        ))}
      </Box>

      <MealDetailsDialog meal={dialog.selectedMeal} open={dialog.open} onClose={dialog.close} />

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        maxWidth="xs"
        slotProps={{ paper: { sx: { borderRadius: 5 } } }}
      >
        <DialogContent sx={{ p: 4 }}>
          <Typography variant="h5" component="h2" sx={{ mb: 1 }}>
            Limpar a semana?
          </Typography>
          <Typography color="text.secondary">
            {plannedCount === 1
              ? 'A refeição planejada será removida.'
              : `As ${plannedCount} refeições planejadas serão removidas.`}{' '}
            Seus favoritos continuam salvos.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 4, pb: 4, pt: 0 }}>
          <Button onClick={() => setConfirmOpen(false)} color="inherit">
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              dispatch(clearWeek())
              setConfirmOpen(false)
            }}
          >
            Limpar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
