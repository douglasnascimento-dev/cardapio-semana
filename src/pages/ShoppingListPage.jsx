import { useEffect } from 'react'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  LinearProgress,
  Skeleton,
  Typography,
} from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import RemoveDoneIcon from '@mui/icons-material/RemoveDone'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMealById } from '../store/mealsSlice'
import { clearChecked, toggleChecked } from '../store/shoppingSlice'
import {
  selectMissingMealIds,
  selectPlannedMeals,
  selectShoppingList,
} from '../store/selectors'
import ShoppingItem from '../components/ShoppingItem'
import EmptyState from '../components/EmptyState'

function PlannedMeals({ meals, requests, onRetry }) {
  return (
    <Box
      component="aside"
      sx={{
        position: { md: 'sticky' },
        top: { md: 112 },
        p: 3,
        borderRadius: 4,
        bgcolor: 'background.paper',
        border: 1,
        borderColor: 'divider',
      }}
    >
      <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
        Receitas da semana
      </Typography>
      <Box
        component="ul"
        sx={{ listStyle: 'none', p: 0, m: 0, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 1.5 }}
      >
        {meals.map(({ id, count, meal }) => (
          <Box component="li" key={id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {meal ? (
              <Box
                component="img"
                src={`${meal.thumb}/small`}
                alt=""
                sx={{ width: 44, height: 44, borderRadius: 2.5, objectFit: 'cover', flexShrink: 0 }}
              />
            ) : (
              <Skeleton variant="rounded" width={44} height={44} />
            )}
            <Typography sx={{ flex: 1, minWidth: 0, fontSize: 14 }} noWrap>
              {meal?.name ?? 'Carregando...'}
            </Typography>
            {count > 1 && (
              <Typography variant="body2" color="text.secondary">
                {count}×
              </Typography>
            )}
            {requests[id] === 'loading' && <CircularProgress size={16} color="inherit" />}
            {requests[id] === 'error' && (
              <IconButton size="small" aria-label={`Tentar carregar ${meal?.name ?? 'receita'} de novo`} onClick={() => onRetry(id)}>
                <RefreshIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default function ShoppingListPage({ onNavigate }) {
  const dispatch = useDispatch()
  const list = useSelector(selectShoppingList)
  const plannedMeals = useSelector(selectPlannedMeals)
  const missingIds = useSelector(selectMissingMealIds)
  const requests = useSelector((state) => state.meals.requests)

  // Receitas planejadas a partir de um filtro não têm ingredientes no
  // cache. O thunk busca cada uma (e ignora as que já estão carregando).
  useEffect(() => {
    missingIds.forEach((id) => dispatch(fetchMealById(id)))
  }, [missingIds, dispatch])

  const failedIds = missingIds.filter((id) => requests[id] === 'error')
  const loadingCount = missingIds.length - failedIds.length

  if (plannedMeals.length === 0) {
    return (
      <EmptyState
        title="Sua lista está vazia"
        description="Adicione receitas ao planejador e os ingredientes aparecem aqui, já agrupados."
        action={
          <Button variant="contained" onClick={() => onNavigate('planner')}>
            Ir para o planejador
          </Button>
        }
      />
    )
  }

  return (
    <Box
      sx={{
        display: 'grid',
        // minmax(0, 1fr): sem isso a coluna não encolhe abaixo do conteúdo
        // e empurra a coluna lateral para fora da tela
        gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(0, 1fr) 300px' },
        gap: { xs: 4, md: 6 },
        alignItems: 'start',
      }}
    >
      <Box>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            mb: 3,
          }}
        >
          <Box sx={{ flex: '1 1 240px', maxWidth: 360 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {list.checkedCount} de {list.total} itens comprados
            </Typography>
            <LinearProgress
              variant="determinate"
              value={list.total ? (list.checkedCount / list.total) * 100 : 0}
              color="secondary"
              sx={{ height: 4, borderRadius: 2, bgcolor: 'divider' }}
            />
          </Box>
          {list.checkedCount > 0 && (
            <Button
              color="inherit"
              startIcon={<RemoveDoneIcon />}
              onClick={() => dispatch(clearChecked())}
              sx={{ color: 'text.secondary' }}
            >
              Desmarcar todos
            </Button>
          )}
        </Box>

        {failedIds.length > 0 && (
          <Alert
            severity="warning"
            sx={{ mb: 3, borderRadius: 3 }}
            action={
              <Button color="inherit" size="small" onClick={() => failedIds.forEach((id) => dispatch(fetchMealById(id)))}>
                Tentar de novo
              </Button>
            }
          >
            Não foi possível carregar os ingredientes de {failedIds.length}{' '}
            {failedIds.length === 1 ? 'receita' : 'receitas'}.
          </Alert>
        )}

        {loadingCount > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Carregando ingredientes de {loadingCount} {loadingCount === 1 ? 'receita' : 'receitas'}...
            </Typography>
            {Array.from({ length: 3 }, (_, i) => (
              <Skeleton key={i} height={56} />
            ))}
          </Box>
        )}

        <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, borderTop: 1, borderColor: 'divider' }}>
          {list.items.map((item) => (
            <ShoppingItem key={item.key} item={item} onToggle={(key) => dispatch(toggleChecked(key))} />
          ))}
        </Box>
      </Box>

      <PlannedMeals
        meals={plannedMeals}
        requests={requests}
        onRetry={(id) => dispatch(fetchMealById(id))}
      />
    </Box>
  )
}
