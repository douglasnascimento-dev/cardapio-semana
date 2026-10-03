import { useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { setMeal } from '../store/planSlice'
import { DAYS, SLOTS, todayId } from '../utils/week'

const groupSx = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 1,
  // Botões separados (não colados), no estilo das pílulas de categoria
  '& .MuiToggleButtonGroup-grouped': {
    border: 1,
    borderColor: 'divider',
    borderRadius: '999px !important',
    m: 0,
    px: 2,
    py: 0.75,
    textTransform: 'none',
    fontWeight: 500,
    color: 'text.primary',
  },
  '& .MuiToggleButtonGroup-grouped.Mui-selected, & .MuiToggleButtonGroup-grouped.Mui-selected:hover': {
    bgcolor: 'primary.main',
    color: 'primary.contrastText',
    borderColor: 'primary.main',
  },
}

// Sugere a primeira refeição vazia a partir de hoje
function firstEmptySlot(days) {
  const start = DAYS.findIndex((d) => d.id === todayId())
  const ordered = [...DAYS.slice(start), ...DAYS.slice(0, start)]
  for (const day of ordered) {
    for (const slot of SLOTS) {
      if (!days[day.id][slot.id]) return { day: day.id, slot: slot.id }
    }
  }
  return { day: todayId(), slot: SLOTS[0].id }
}

export default function AddToPlanDialog({ meal, open, onClose, onAdded }) {
  const dispatch = useDispatch()
  const days = useSelector((state) => state.plan.days)
  const mealsById = useSelector((state) => state.meals.byId)
  // Calculado só quando o componente é montado (a janela abre)
  const [choice, setChoice] = useState(() => firstEmptySlot(days))

  const currentId = days[choice.day][choice.slot]
  const replacing = currentId && currentId !== meal.id ? mealsById[currentId] : null

  const handleConfirm = () => {
    dispatch(setMeal({ ...choice, meal }))
    onAdded?.(choice)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth slotProps={{ paper: { sx: { borderRadius: 5 } } }}>
      <DialogContent sx={{ p: 4 }}>
        <Typography variant="overline" color="secondary">
          Adicionar ao cardápio
        </Typography>
        <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
          {meal.name}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          Dia
        </Typography>
        <ToggleButtonGroup
          exclusive
          value={choice.day}
          onChange={(e, day) => day && setChoice((prev) => ({ ...prev, day }))}
          sx={groupSx}
        >
          {DAYS.map((d) => (
            <ToggleButton key={d.id} value={d.id} size="small">
              {d.short}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 3, mb: 1.5 }}>
          Refeição
        </Typography>
        <ToggleButtonGroup
          exclusive
          value={choice.slot}
          onChange={(e, slot) => slot && setChoice((prev) => ({ ...prev, slot }))}
          sx={groupSx}
        >
          {SLOTS.map((s) => (
            <ToggleButton key={s.id} value={s.id} size="small">
              {s.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <Box sx={{ minHeight: 24, mt: 3 }}>
          {replacing && (
            <Typography variant="body2" color="text.secondary">
              Vai substituir <strong>{replacing.name}</strong>.
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 4, pb: 4, pt: 0 }}>
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
        <Button onClick={handleConfirm} variant="contained">
          {replacing ? 'Substituir' : 'Adicionar'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
