import { Box, Checkbox, Typography } from '@mui/material'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import IngredientImage from './IngredientImage'

export default function ShoppingItem({ item, onToggle }) {
  return (
    <Box
      component="li"
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
        transition: 'opacity 0.2s',
        opacity: item.checked ? 0.45 : 1,
      }}
    >
      <Box
        component="label"
        sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1.25, cursor: 'pointer' }}
      >
        <Checkbox
          checked={item.checked}
          onChange={() => onToggle(item.key)}
          icon={<RadioButtonUncheckedIcon />}
          checkedIcon={<CheckCircleIcon />}
          color="secondary"
          sx={{ p: 0.5 }}
        />
        <IngredientImage name={item.name} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: 15,
              fontWeight: 500,
              textDecoration: item.checked ? 'line-through' : 'none',
              '&::first-letter': { textTransform: 'uppercase' },
            }}
          >
            {item.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap sx={{ fontSize: 13 }}>
            {item.meals.join(', ')}
          </Typography>
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: 'right', maxWidth: { xs: 120, sm: 220 } }}
        >
          {item.quantity}
        </Typography>
      </Box>
    </Box>
  )
}
