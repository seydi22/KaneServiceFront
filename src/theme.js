import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0D9488',
      dark: '#0F766E',
      light: '#14B8A6',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#7C3AED',
      dark: '#6D28D9',
      light: '#8B5CF6',
      contrastText: '#FFFFFF'
    },
    success: {
      main: '#059669',
      dark: '#047857',
      light: '#10B981',
      contrastText: '#FFFFFF'
    },
    error: {
      main: '#DC2626',
      dark: '#B91C1C',
      light: '#EF4444',
      contrastText: '#FFFFFF'
    },
    warning: {
      main: '#D97706',
      dark: '#B45309',
      light: '#F59E0B',
      contrastText: '#FFFFFF'
    },
    info: {
      main: '#0891B2',
      dark: '#0E7490',
      light: '#22D3EE',
      contrastText: '#FFFFFF'
    },
    grey: {
      50: '#FAFAFA',
      100: '#F4F4F5',
      200: '#E4E4E7',
      300: '#D4D4D8',
      400: '#A1A1AA',
      500: '#71717A',
      600: '#52525B',
      700: '#3F3F46',
      800: '#27272A',
      900: '#18181B'
    },
    text: {
      primary: '#E5E7EB',
      secondary: '#94A3B8',
      disabled: '#475569'
    },
    background: {
      default: '#070B14',
      paper: '#0B1220'
    },
    divider: 'rgba(148, 163, 184, 0.18)'
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em'
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 700,
      lineHeight: 1.25,
      letterSpacing: '-0.01em'
    },
    h3: {
      fontSize: '1.25rem',
      fontWeight: 700,
      lineHeight: 1.3
    },
    h4: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.5
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.01em'
    }
  },
  shape: {
    borderRadius: 10
  },
  shadows: [
    'none',
    '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
    '0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.04)',
    '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.12)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.12)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.12)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.12)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.12)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.12)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.12)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.12)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.12)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.12)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.12)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.12)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.12)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.12)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.12)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.12)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.12)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.12)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.12)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.12)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.12)'
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#070B14',
          color: '#E5E7EB',
        },
        '*::-webkit-scrollbar': {
          width: 10,
          height: 10,
        },
        '*::-webkit-scrollbar-track': {
          backgroundColor: 'rgba(148, 163, 184, 0.08)',
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(148, 163, 184, 0.22)',
          borderRadius: 999,
          border: '2px solid rgba(7, 11, 20, 0.55)',
        },
        '*::-webkit-scrollbar-thumb:hover': {
          backgroundColor: 'rgba(148, 163, 184, 0.32)',
        },
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          padding: '12px 24px',
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: 'none',
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: '0 10px 24px rgba(13, 148, 136, 0.22)',
            transform: 'translateY(-1px)'
          },
          '&:active': {
            transform: 'translateY(0)'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 18px 40px rgba(0, 0, 0, 0.35)',
          border: '1px solid rgba(148, 163, 184, 0.18)',
          transition: 'box-shadow 0.2s ease'
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '10px',
            backgroundColor: 'rgba(148, 163, 184, 0.04)',
            transition: 'box-shadow 0.18s ease, background-color 0.18s ease, border-color 0.18s ease',
            '&:hover': {
              backgroundColor: 'rgba(148, 163, 184, 0.06)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderWidth: '2px',
              borderColor: 'rgba(13, 148, 136, 0.85)',
            }
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(148, 163, 184, 0.22)',
          },
          '& .MuiFormLabel-root.Mui-focused': {
            color: 'rgba(13, 148, 136, 0.9)',
          }
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          paddingTop: 12,
          paddingBottom: 12,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          border: '1px solid rgba(148, 163, 184, 0.18)',
          backgroundImage: 'none',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          marginLeft: 6,
          marginRight: 6,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: 'rgba(2, 6, 23, 0.92)',
          border: '1px solid rgba(148, 163, 184, 0.18)',
          borderRadius: 10,
          fontSize: '0.8rem',
          padding: '8px 10px',
        },
        arrow: {
          color: 'rgba(2, 6, 23, 0.92)',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 42,
        },
        indicator: {
          height: 3,
          borderRadius: 999,
          backgroundColor: '#14B8A6',
          boxShadow: '0 8px 20px rgba(20, 184, 166, 0.22)',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 42,
          textTransform: 'none',
          fontWeight: 700,
          letterSpacing: '-0.01em',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          color: '#E5E7EB',
          borderBottom: '1px solid rgba(148, 163, 184, 0.18)',
        },
        body: {
          borderBottom: '1px solid rgba(148, 163, 184, 0.12)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: '12px'
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.35)'
        }
      }
    }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280
    }
  }
})

export default theme
