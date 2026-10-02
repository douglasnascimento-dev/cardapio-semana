import { useState } from 'react'
import { Box, Button, IconButton, InputAdornment, TextField, Typography } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import useDebounce from '../hooks/useDebounce'
import useMealSearch from '../hooks/useMealSearch'
import useFilterOptions from '../hooks/useFilterOptions'
import MealGrid from '../components/MealGrid'
import EmptyState from '../components/EmptyState'
import FilterBar from '../components/FilterBar'
import MealDetailsDialog from '../components/MealDetailsDialog'
import { areaLabel, categoryLabel } from '../utils/labels'

const NO_FILTERS = { category: '', area: '', ingredient: '' }

export default function ExplorePage() {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState(NO_FILTERS)
  // A receita selecionada continua guardada depois de fechar a janela,
  // para o conteúdo não sumir durante a animação de saída.
  const [selectedMeal, setSelectedMeal] = useState(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const debouncedQuery = useDebounce(query)
  const options = useFilterOptions()
  const { meals, status, error, retry } = useMealSearch({ query: debouncedQuery, ...filters })

  const searchText = debouncedQuery.trim()
  const activeFilters = [
    filters.category && categoryLabel(filters.category),
    filters.area && areaLabel(filters.area),
    filters.ingredient && `com ${filters.ingredient}`,
  ].filter(Boolean)

  let heading = 'Em destaque'
  if (searchText) heading = `Resultados para “${searchText}”`
  else if (activeFilters.length > 0) heading = activeFilters.join(' · ')

  const updateFilters = (changes) => setFilters((prev) => ({ ...prev, ...changes }))

  const openDetails = (meal) => {
    setSelectedMeal(meal)
    setDetailsOpen(true)
  }

  const clearAll = () => {
    setQuery('')
    setFilters(NO_FILTERS)
  }

  return (
    <Box>
      <TextField
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar receitas, ex.: lasagna, curry, salmon..."
        fullWidth
        autoComplete="off"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
            endAdornment: query && (
              <InputAdornment position="end">
                <IconButton aria-label="Limpar busca" onClick={() => setQuery('')} edge="end">
                  <CloseIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        sx={{
          maxWidth: 640,
          mb: 3,
          '& .MuiOutlinedInput-root': {
            borderRadius: 999,
            bgcolor: 'background.paper',
            pl: 1,
            fontSize: 16,
          },
          '& .MuiOutlinedInput-input': { py: 1.75 },
        }}
      />

      <FilterBar
        options={options}
        filters={filters}
        onChange={updateFilters}
        onClear={() => setFilters(NO_FILTERS)}
      />

      <Box
        sx={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: 2,
          mt: 6,
          mb: 3,
        }}
      >
        <Typography variant="h5" component="h2">
          {heading}
        </Typography>
        {status === 'success' && meals.length > 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0 }}>
            {meals.length} {meals.length === 1 ? 'receita' : 'receitas'}
          </Typography>
        )}
      </Box>

      {status === 'loading' && <MealGrid loading />}

      {status === 'error' && (
        <EmptyState
          title="Não foi possível carregar as receitas"
          description={error}
          action={<Button variant="contained" onClick={retry}>Tentar novamente</Button>}
        />
      )}

      {status === 'success' && meals.length === 0 && (
        <EmptyState
          title="Nenhuma receita encontrada"
          description={
            activeFilters.length > 0
              ? 'Nenhuma receita atende a essa combinação. Tente remover algum filtro.'
              : 'A TheMealDB tem receitas em inglês. Tente termos como chicken, pasta ou cake.'
          }
          action={<Button variant="outlined" onClick={clearAll}>Limpar busca e filtros</Button>}
        />
      )}

      {status === 'success' && meals.length > 0 && (
        <MealGrid meals={meals} onSelect={openDetails} />
      )}

      <MealDetailsDialog
        meal={selectedMeal}
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
      />
    </Box>
  )
}
