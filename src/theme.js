import { createTheme } from '@mui/material/styles'

const colors = {
  ink: '#1F1E1B',
  muted: '#6F6C64',
  cream: '#FAF8F4',
  paper: '#FFFFFF',
  line: '#E8E3DA',
  accent: '#B4532A',
}

const serif = '"Fraunces", Georgia, serif'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: colors.ink, contrastText: colors.cream },
    secondary: { main: colors.accent },
    background: { default: colors.cream, paper: colors.paper },
    text: { primary: colors.ink, secondary: colors.muted },
    divider: colors.line,
  },
  shape: { borderRadius: 4 },
  typography: {
    fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
    h1: { fontFamily: serif, fontWeight: 500, letterSpacing: '-0.03em' },
    h2: { fontFamily: serif, fontWeight: 500, letterSpacing: '-0.025em' },
    h3: { fontFamily: serif, fontWeight: 500, letterSpacing: '-0.02em' },
    h4: { fontFamily: serif, fontWeight: 500, letterSpacing: '-0.015em' },
    h5: { fontFamily: serif, fontWeight: 500 },
    h6: { fontFamily: serif, fontWeight: 500 },
    overline: { fontWeight: 600, letterSpacing: '0.14em' },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  components: {
    MuiAppBar: {
      defaultProps: { elevation: 0, color: 'inherit' },
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(250, 248, 244, 0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${colors.line}`,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: { height: 2, backgroundColor: colors.ink },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minWidth: 0,
          minHeight: 64,
          padding: '0 2px',
          marginInline: 14,
          fontSize: 15,
          fontWeight: 500,
          textTransform: 'none',
          color: colors.muted,
          '&.Mui-selected': { color: colors.ink },
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 999, paddingInline: 20 },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { border: `1px solid ${colors.line}` },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 500 },
      },
    },
  },
})

export default theme
