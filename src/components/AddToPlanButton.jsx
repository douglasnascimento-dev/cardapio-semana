import { useState } from 'react'
import { Button, Snackbar } from '@mui/material'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import AddToPlanDialog from './AddToPlanDialog'
import { dayLabel, slotLabel } from '../utils/week'

export default function AddToPlanButton({ meal }) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')

  return (
    <>
      <Button variant="contained" startIcon={<EventAvailableIcon />} onClick={() => setOpen(true)}>
        Adicionar ao plano
      </Button>

      {/* Montado só quando aberto, para a sugestão de dia ser recalculada */}
      {open && (
        <AddToPlanDialog
          meal={meal}
          open={open}
          onClose={() => setOpen(false)}
          onAdded={({ day, slot }) => setMessage(`Adicionado a ${dayLabel(day)} · ${slotLabel(slot)}`)}
        />
      )}

      <Snackbar
        open={Boolean(message)}
        message={message}
        autoHideDuration={3000}
        onClose={() => setMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  )
}
