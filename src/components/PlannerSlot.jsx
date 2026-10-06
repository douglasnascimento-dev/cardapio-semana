import { useState } from 'react'
import {
  Box,
  ButtonBase,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'

const slotSx = {
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  width: '100%',
  minHeight: 96,
  p: 1.5,
  borderRadius: 4,
  border: 1,
  borderColor: 'divider',
}

function EmptySlot({ slot, favorites, onPick, onExplore }) {
  const [anchor, setAnchor] = useState(null)
  const close = () => setAnchor(null)

  return (
    <>
      <ButtonBase
        onClick={(e) => setAnchor(e.currentTarget)}
        sx={{
          ...slotSx,
          borderStyle: 'dashed',
          justifyContent: 'flex-start',
          color: 'text.secondary',
          transition: 'border-color 0.2s, color 0.2s',
          '&:hover': { borderColor: 'text.primary', color: 'text.primary' },
        }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: 3,
            bgcolor: 'background.default',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <AddIcon />
        </Box>
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant="overline" sx={{ fontSize: 11, display: 'block', lineHeight: 1.6 }}>
            {slot.label}
          </Typography>
          <Typography sx={{ fontSize: 15 }}>Adicionar</Typography>
        </Box>
      </ButtonBase>

      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={close}
        slotProps={{ paper: { sx: { borderRadius: 3, minWidth: 280, maxWidth: 340 } } }}
      >
        {favorites.length > 0 && <ListSubheader sx={{ lineHeight: '36px' }}>Dos seus favoritos</ListSubheader>}
        {favorites.slice(0, 6).map((meal) => (
          <MenuItem
            key={meal.id}
            onClick={() => {
              onPick(meal)
              close()
            }}
          >
            <ListItemIcon>
              <Box
                component="img"
                src={`${meal.thumb}/small`}
                alt=""
                sx={{ width: 32, height: 32, borderRadius: 1.5, objectFit: 'cover' }}
              />
            </ListItemIcon>
            <ListItemText primary={meal.name} slotProps={{ primary: { noWrap: true, sx: { pl: 1 } } }} />
          </MenuItem>
        ))}
        {favorites.length > 0 && <Divider />}
        <MenuItem
          onClick={() => {
            close()
            onExplore()
          }}
        >
          <ListItemIcon>
            <SearchIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Buscar receitas" />
        </MenuItem>
      </Menu>
    </>
  )
}

function FilledSlot({ slot, meal, onOpen, onRemove }) {
  return (
    <Box sx={{ ...slotSx, bgcolor: 'background.paper', position: 'relative' }}>
      <ButtonBase
        onClick={() => onOpen(meal)}
        sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 0, justifyContent: 'flex-start', borderRadius: 3 }}
      >
        <Box
          component="img"
          src={`${meal.thumb}/small`}
          alt=""
          sx={{ width: 64, height: 64, borderRadius: 3, objectFit: 'cover', flexShrink: 0 }}
        />
        <Box sx={{ textAlign: 'left', minWidth: 0 }}>
          <Typography
            variant="overline"
            color="text.secondary"
            sx={{ fontSize: 11, display: 'block', lineHeight: 1.6 }}
          >
            {slot.label}
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Fraunces", Georgia, serif',
              fontSize: 17,
              lineHeight: 1.3,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {meal.name}
          </Typography>
        </Box>
      </ButtonBase>
      <IconButton aria-label={`Remover ${meal.name} do ${slot.label.toLowerCase()}`} onClick={onRemove} size="small">
        <CloseIcon fontSize="small" />
      </IconButton>
    </Box>
  )
}

export default function PlannerSlot({ slot, meal, favorites, onPick, onOpen, onRemove, onExplore }) {
  if (meal) {
    return <FilledSlot slot={slot} meal={meal} onOpen={onOpen} onRemove={onRemove} />
  }
  return <EmptySlot slot={slot} favorites={favorites} onPick={onPick} onExplore={onExplore} />
}
