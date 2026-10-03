import {
  Box,
  Button,
  Chip,
  Dialog,
  IconButton,
  Skeleton,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutlineOutlined'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import useMealDetails from '../hooks/useMealDetails'
import FavoriteButton from './FavoriteButton'
import { ingredientImage } from '../api/mealdb'
import { areaLabel, categoryLabel } from '../utils/labels'

function SectionTitle({ children, aside }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        pb: 1.5,
        mb: 1,
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Typography variant="h6" component="h3">
        {children}
      </Typography>
      {aside && (
        <Typography variant="body2" color="text.secondary">
          {aside}
        </Typography>
      )}
    </Box>
  )
}

function IngredientList({ ingredients }) {
  return (
    <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
      {ingredients.map((item, index) => (
        <Box
          component="li"
          key={`${item.name}-${index}`}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            py: 1,
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Box
            component="img"
            src={ingredientImage(item.name)}
            alt=""
            loading="lazy"
            sx={{ width: 36, height: 36, objectFit: 'contain', flexShrink: 0 }}
          />
          <Typography sx={{ flex: 1, fontSize: 15, '&::first-letter': { textTransform: 'uppercase' } }}>
            {item.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'right' }}>
            {item.measure}
          </Typography>
        </Box>
      ))}
    </Box>
  )
}

function StepList({ steps }) {
  return (
    <Box component="ol" sx={{ listStyle: 'none', p: 0, m: 0 }}>
      {steps.map((step, index) => (
        <Box component="li" key={index} sx={{ display: 'flex', gap: 2.5, py: 1.75 }}>
          <Typography
            sx={{
              fontFamily: '"Fraunces", Georgia, serif',
              fontSize: 22,
              lineHeight: 1.2,
              color: 'secondary.main',
              minWidth: 28,
            }}
          >
            {String(index + 1).padStart(2, '0')}
          </Typography>
          <Typography sx={{ fontSize: 15, lineHeight: 1.75 }}>{step}</Typography>
        </Box>
      ))}
    </Box>
  )
}

function DetailsSkeleton() {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { md: '5fr 7fr' }, gap: 6 }}>
      <Box>
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} height={44} />
        ))}
      </Box>
      <Box>
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} height={72} />
        ))}
      </Box>
    </Box>
  )
}

// `meal` pode ser só o resumo vindo do card (id, nome e foto). Ele é
// mostrado na hora, enquanto o restante é carregado pelo useMealDetails.
export default function MealDetailsDialog({ meal, open, onClose, actions }) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const { meal: details, status, error, retry } = useMealDetails(meal?.id)

  if (!meal) return null

  const data = details ?? meal
  const subtitle = [
    data.category && categoryLabel(data.category),
    data.area && areaLabel(data.area),
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="md"
      fullWidth
      scroll="body"
      slotProps={{ paper: { sx: { borderRadius: fullScreen ? 0 : 5, overflow: 'hidden' } } }}
    >
      <Box sx={{ position: 'relative' }}>
        <Box
          component="img"
          src={`${data.thumb}/large`}
          alt={data.name}
          sx={{
            display: 'block',
            width: '100%',
            aspectRatio: { xs: '4 / 3', sm: '16 / 8' },
            objectFit: 'cover',
            bgcolor: 'divider',
          }}
        />
        <IconButton
          aria-label="Fechar"
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(8px)',
            '&:hover': { bgcolor: 'background.paper' },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ p: { xs: 3, sm: 5 } }}>
        {subtitle && (
          <Typography variant="overline" color="secondary">
            {subtitle}
          </Typography>
        )}
        <Typography
          variant="h3"
          component="h2"
          sx={{ fontSize: { xs: '1.9rem', sm: '2.5rem' }, mt: 0.5, mb: 2 }}
        >
          {data.name}
        </Typography>

        {details?.tags.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
            {details.tags.map((tag) => (
              <Chip key={tag} label={tag} size="small" variant="outlined" />
            ))}
          </Box>
        )}

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 1,
            pb: 4,
            mb: 4,
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <FavoriteButton meal={data} variant="button" />
          {/* Espaço para o botão de adicionar ao plano (fase 7) */}
          {actions}
          <Box sx={{ flex: 1 }} />
          {details?.youtube && (
            <Button
              href={details.youtube}
              target="_blank"
              rel="noreferrer"
              variant="outlined"
              color="inherit"
              startIcon={<PlayCircleOutlineIcon />}
            >
              Assistir vídeo
            </Button>
          )}
          {details?.source && (
            <Button
              href={details.source}
              target="_blank"
              rel="noreferrer"
              color="inherit"
              endIcon={<OpenInNewIcon fontSize="small" />}
              sx={{ color: 'text.secondary' }}
            >
              Fonte
            </Button>
          )}
        </Box>

        {status === 'loading' && <DetailsSkeleton />}

        {status === 'error' && (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography sx={{ mb: 2 }}>Não foi possível carregar a receita. {error}</Typography>
            <Button variant="contained" onClick={retry}>
              Tentar novamente
            </Button>
          </Box>
        )}

        {status === 'success' && details && (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { md: '5fr 7fr' },
              gap: { xs: 5, md: 6 },
              alignItems: 'start',
            }}
          >
            <Box>
              <SectionTitle aside={`${details.ingredients.length} itens`}>Ingredientes</SectionTitle>
              <IngredientList ingredients={details.ingredients} />
            </Box>
            <Box>
              <SectionTitle>Modo de preparo</SectionTitle>
              <StepList steps={details.steps} />
            </Box>
          </Box>
        )}
      </Box>
    </Dialog>
  )
}
