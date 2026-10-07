import { Box, Typography } from '@mui/material'

export default function EmptyState({ title, description, action }) {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        textAlign: 'center',
        border: 1,
        borderColor: 'divider',
        borderStyle: 'dashed',
        borderRadius: 4,
      }}
    >
      <Typography variant="h5" component="p" sx={{ mb: 1 }}>
        {title}
      </Typography>
      {description && (
        <Typography color="text.secondary" sx={{ maxWidth: 420, mx: 'auto' }}>
          {description}
        </Typography>
      )}
      {action && <Box sx={{ mt: 3 }}>{action}</Box>}
    </Box>
  )
}
