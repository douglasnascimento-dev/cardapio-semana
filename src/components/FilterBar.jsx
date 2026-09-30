import { Autocomplete, Box, Button, Chip, TextField, createFilterOptions } from '@mui/material'
import { AREAS, categoryLabel } from '../utils/labels'

// São quase mil ingredientes: mostrar só os primeiros que batem com o texto
const filterIngredients = createFilterOptions({ limit: 60 })

const fieldSx = {
  width: { xs: '100%', sm: 240 },
  '& .MuiOutlinedInput-root': { borderRadius: 999, bgcolor: 'background.paper', pl: 1.5 },
}

export default function FilterBar({ options, filters, onChange, onClear }) {
  const { category, area, ingredient } = filters
  const hasFilters = Boolean(category || area || ingredient)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          overflowX: 'auto',
          pb: 0.5,
          mx: { xs: -2, sm: 0 },
          px: { xs: 2, sm: 0 },
          flexWrap: { md: 'wrap' },
          scrollbarWidth: 'none',
        }}
      >
        <Chip
          label="Todas"
          variant={category ? 'outlined' : 'filled'}
          color={category ? 'default' : 'primary'}
          onClick={() => onChange({ category: '' })}
        />
        {options.categories.map((c) => (
          <Chip
            key={c}
            label={categoryLabel(c)}
            variant={category === c ? 'filled' : 'outlined'}
            color={category === c ? 'primary' : 'default'}
            onClick={() => onChange({ category: category === c ? '' : c })}
          />
        ))}
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}>
        <Autocomplete
          size="small"
          options={AREAS}
          value={AREAS.find((a) => a.value === area) ?? null}
          onChange={(e, option) => onChange({ area: option?.value ?? '' })}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          noOptionsText="Nenhuma origem encontrada"
          renderInput={(params) => <TextField {...params} placeholder="Origem" />}
          sx={fieldSx}
        />

        <Autocomplete
          size="small"
          options={options.ingredients}
          value={ingredient || null}
          onChange={(e, option) => onChange({ ingredient: option ?? '' })}
          filterOptions={filterIngredients}
          noOptionsText="Nenhum ingrediente encontrado"
          renderInput={(params) => <TextField {...params} placeholder="Ingrediente (em inglês)" />}
          sx={fieldSx}
        />

        {hasFilters && (
          <Button onClick={onClear} color="inherit" sx={{ color: 'text.secondary' }}>
            Limpar filtros
          </Button>
        )}
      </Box>
    </Box>
  )
}
