import { useState } from 'react'
import { AppBar, Box, Container, Tab, Tabs, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import ExplorePage from './pages/ExplorePage'
import PlannerPage from './pages/PlannerPage'
import ShoppingListPage from './pages/ShoppingListPage'
import FavoritesPage from './pages/FavoritesPage'
import {
  selectFavoritesCount,
  selectPlannedCount,
  selectRemainingCount,
} from './store/selectors'

const TABS = [
  {
    id: 'explore',
    label: 'Explorar',
    title: 'O que vamos cozinhar?',
    subtitle: 'Receitas do mundo todo, por nome, categoria, origem ou ingrediente.',
    Page: ExplorePage,
  },
  {
    id: 'planner',
    label: 'Planejador',
    title: 'Sua semana à mesa',
    subtitle: 'Organize almoço e jantar de segunda a domingo.',
    Page: PlannerPage,
  },
  {
    id: 'shopping',
    label: 'Lista de compras',
    title: 'Lista de compras',
    subtitle: 'Gerada automaticamente a partir do seu cardápio.',
    Page: ShoppingListPage,
  },
  {
    id: 'favorites',
    label: 'Favoritos',
    title: 'Favoritos',
    subtitle: 'As receitas que você quer ter sempre por perto.',
    Page: FavoritesPage,
  },
]

// Número discreto ao lado do nome da aba
function TabCount({ value }) {
  if (!value) return null
  return (
    <Box component="span" sx={{ ml: 0.75, fontSize: 12, color: 'secondary.main', fontWeight: 600 }}>
      {value}
    </Box>
  )
}

export default function App() {
  const [tab, setTab] = useState('explore')
  const favoritesCount = useSelector(selectFavoritesCount)
  const current = TABS.find((t) => t.id === tab)
  const plannedCount = useSelector(selectPlannedCount)
  const remainingCount = useSelector(selectRemainingCount)
  const counts = { planner: plannedCount, shopping: remainingCount, favorites: favoritesCount }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="sticky">
        <Container
          maxWidth="lg"
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'flex-start', md: 'center' },
            justifyContent: 'space-between',
          }}
        >
          <Typography
            variant="h5"
            component="span"
            sx={{ pt: { xs: 2, md: 0 }, fontWeight: 600, letterSpacing: '-0.02em' }}
          >
            Cardápio
            <Box component="span" sx={{ color: 'secondary.main' }}>.</Box>
          </Typography>

          <Tabs
            value={tab}
            onChange={(e, newValue) => setTab(newValue)}
            variant="scrollable"
            scrollButtons={false}
            sx={{ mx: { xs: -1.75, md: 0 } }}
          >
            {TABS.map((t) => (
              <Tab
                key={t.id}
                value={t.id}
                label={
                  <span>
                    {t.label}
                    <TabCount value={counts[t.id]} />
                  </span>
                }
                disableRipple
              />
            ))}
          </Tabs>
        </Container>
      </AppBar>

      <Container maxWidth="lg" component="main" sx={{ flex: 1, py: { xs: 5, md: 8 } }}>
        <Box component="header" sx={{ mb: { xs: 4, md: 6 }, maxWidth: 640 }}>
          <Typography variant="overline" color="secondary">
            {current.label}
          </Typography>
          <Typography
            variant="h2"
            component="h1"
            sx={{ fontSize: { xs: '2.25rem', md: '3.25rem' }, mt: 0.5, mb: 1.5 }}
          >
            {current.title}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: 17 }}>
            {current.subtitle}
          </Typography>
        </Box>

        <current.Page onNavigate={setTab} />
      </Container>

      <Box component="footer" sx={{ borderTop: 1, borderColor: 'divider', py: 3 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary">
            Receitas fornecidas pela{' '}
            <Box
              component="a"
              href="https://www.themealdb.com"
              target="_blank"
              rel="noreferrer"
              sx={{ color: 'text.primary' }}
            >
              TheMealDB
            </Box>
          </Typography>
        </Container>
      </Box>
    </Box>
  )
}
