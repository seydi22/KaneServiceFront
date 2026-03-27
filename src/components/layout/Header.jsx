import { AppBar, Toolbar, Typography, Box, IconButton, Menu, MenuItem, Avatar, useMediaQuery, useTheme, Chip } from '@mui/material'
import { Logout, Menu as MenuIcon } from '@mui/icons-material'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useSidebar } from '../../context/SidebarContext'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const { handleDrawerToggle } = useSidebar()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [anchorEl, setAnchorEl] = useState(null)

  // Ne pas afficher le header si l'utilisateur n'est pas authentifié
  if (!isAuthenticated) {
    return null
  }

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
    handleMenuClose()
  }

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: 'rgba(7, 11, 20, 0.82)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.35)',
        zIndex: 'var(--z-fixed)',
        borderBottom: '1px solid var(--border-light)',
      }}
    >
      <Toolbar
        sx={{
          minHeight: { xs: '56px', sm: '64px' },
          paddingX: { xs: 2, sm: 3 },
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="Ouvrir le menu"
              onClick={handleDrawerToggle}
              sx={{
                mr: 1,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: { xs: 1, sm: 0 },
              fontWeight: 700,
              fontSize: { xs: '1.0625rem', sm: '1.25rem' },
              letterSpacing: '-0.03em',
            }}
          >
            KANE
            <Box
              component="span"
              sx={{
                display: { xs: 'none', sm: 'inline' },
                ml: 1.25,
                fontWeight: 500,
                opacity: 0.92,
                letterSpacing: '-0.01em',
                color: 'var(--text-secondary)',
              }}
            >
              Suivi Opérations Financières
            </Box>
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 1, sm: 2 }
          }}
        >
          <Typography
            variant="body2"
            sx={{
              display: { xs: 'none', sm: 'block' },
              color: 'var(--text-secondary)',
              fontWeight: 500
            }}
          >
            {user?.prenom && user?.nom ? `${user.prenom} ${user.nom}` : user?.matricule}
          </Typography>
          <Chip
            size="small"
            label={(user?.role || '').toUpperCase() || 'USER'}
            sx={{
              display: { xs: 'none', sm: 'inline-flex' },
              height: 24,
              borderRadius: 'var(--radius-full)',
              bgcolor: 'rgba(13, 148, 136, 0.14)',
              color: 'var(--color-primary-light)',
              border: '1px solid rgba(13, 148, 136, 0.25)',
              fontWeight: 700,
              letterSpacing: '0.06em'
            }}
          />
          <IconButton
            onClick={handleMenuOpen}
            size="small"
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(148, 163, 184, 0.12)'
              },
              '&:focus-visible': {
                outline: '2px solid rgba(13, 148, 136, 0.55)',
                outlineOffset: '2px'
              }
            }}
            aria-label="Menu utilisateur"
          >
            <Avatar
              sx={{
                width: { xs: 28, sm: 32 },
                height: { xs: 28, sm: 32 },
                bgcolor: 'rgba(13, 148, 136, 0.18)',
                border: '1px solid rgba(13, 148, 136, 0.35)',
                color: 'var(--color-primary-light)',
                fontWeight: 600,
                fontSize: { xs: '0.875rem', sm: '1rem' },
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              {user?.prenom?.[0]?.toUpperCase() || user?.nom?.[0]?.toUpperCase() || user?.matricule?.[0]?.toUpperCase()}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 200,
                boxShadow: 'var(--shadow-lg)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                backgroundColor: 'var(--bg-primary)'
              }
            }}
          >
            <MenuItem
              onClick={handleLogout}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(220, 38, 38, 0.12)'
                },
                '&:focus': {
                  backgroundColor: 'rgba(220, 38, 38, 0.12)'
                }
              }}
            >
              <Logout sx={{ mr: 1.5, fontSize: '1.125rem', color: 'var(--color-error)' }} />
              <Typography variant="body2" sx={{ color: 'var(--color-error)', fontWeight: 500 }}>
                Déconnexion
              </Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header
