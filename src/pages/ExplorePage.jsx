import { useState } from 'react'
import { Box, Button, IconButton, InputAdornment, TextField, Typography } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import useDebounce from '../hooks/useDebounce'
import useMealSearch from '../hooks/useMealSearch'
import MealGrid from '../components/MealGrid'
import EmptyState from '../components/EmptyState'

export default function ExplorePage() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query)
  const { meals, status, error, retry } = useMealSearch(debouncedQuery)

  const searching = debouncedQuery.trim() !== ''

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
          '& .MuiOutlinedInput-root': {
            borderRadius: 999,
            bgcolor: 'background.paper',
            pl: 1,
            fontSize: 16,
          },
          '& .MuiOutlinedInput-input': { py: 1.75 },
        }}
      />

      <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', mt: 6, mb: 3 }}>
        <Typography variant="h5" component="h2">
          {searching ? `Resultados para “${debouncedQuery.trim()}”` : 'Em destaque'}
        </Typography>
        {status === 'success' && meals.length > 0 && (
          <Typography variant="body2" color="text.secondary">
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
          description="A TheMealDB tem receitas em inglês. Tente termos como chicken, pasta ou cake."
          action={<Button variant="outlined" onClick={() => setQuery('')}>Limpar busca</Button>}
        />
      )}

      {status === 'success' && meals.length > 0 && <MealGrid meals={meals} />}
    </Box>
  )
}
