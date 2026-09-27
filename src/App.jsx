import { useState } from 'react'
import { AppBar, Box, Container, Tab, Tabs, Toolbar, Typography } from '@mui/material'
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'
import ExplorePage from './pages/ExplorePage'
import PlannerPage from './pages/PlannerPage'
import ShoppingListPage from './pages/ShoppingListPage'
import FavoritesPage from './pages/FavoritesPage'

const TABS = [
  { label: 'Explorar', page: <ExplorePage /> },
  { label: 'Planejador', page: <PlannerPage /> },
  { label: 'Lista de compras', page: <ShoppingListPage /> },
  { label: 'Favoritos', page: <FavoritesPage /> },
]

export default function App() {
  const [tab, setTab] = useState(0)

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <RestaurantMenuIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Cardápio da Semana</Typography>
        </Toolbar>
        <Tabs
          value={tab}
          onChange={(e, newValue) => setTab(newValue)}
          textColor="inherit"
          indicatorColor="secondary"
          variant="scrollable"
        >
          {TABS.map((t) => (
            <Tab key={t.label} label={t.label} />
          ))}
        </Tabs>
      </AppBar>

      <Container sx={{ py: 3 }}>
        <Box>{TABS[tab].page}</Box>
      </Container>
    </>
  )
}