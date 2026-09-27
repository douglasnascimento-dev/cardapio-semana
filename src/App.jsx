import { useState } from 'react'
import { AppBar, Box, Container, Tab, Tabs, Typography } from '@mui/material'
import ExplorePage from './pages/ExplorePage'
import PlannerPage from './pages/PlannerPage'
import ShoppingListPage from './pages/ShoppingListPage'
import FavoritesPage from './pages/FavoritesPage'

const TABS = [
  {
    label: 'Explorar',
    title: 'O que vamos cozinhar?',
    subtitle: 'Receitas do mundo todo, por nome, categoria, origem ou ingrediente.',
    page: <ExplorePage />,
  },
  {
    label: 'Planejador',
    title: 'Sua semana à mesa',
    subtitle: 'Organize almoço e jantar de segunda a domingo.',
    page: <PlannerPage />,
  },
  {
    label: 'Lista de compras',
    title: 'Lista de compras',
    subtitle: 'Gerada automaticamente a partir do seu cardápio.',
    page: <ShoppingListPage />,
  },
  {
    label: 'Favoritos',
    title: 'Favoritos',
    subtitle: 'As receitas que você quer ter sempre por perto.',
    page: <FavoritesPage />,
  },
]

export default function App() {
  const [tab, setTab] = useState(0)
  const current = TABS[tab]

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
              <Tab key={t.label} label={t.label} disableRipple />
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

        {current.page}
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
