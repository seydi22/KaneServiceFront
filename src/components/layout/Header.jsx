import { AppBar, Toolbar, Typography, Box, IconButton, Menu, MenuItem, Avatar, useMediaQuery, useTheme } from '@mui/material'
import { AccountCircle, Logout, Menu as MenuIcon } from '@mui/icons-material'
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
        backgroundColor: 'var(--color-primary)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        zIndex: 'var(--z-fixed)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
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
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: 500
            }}
          >
            {user?.prenom && user?.nom ? `${user.prenom} ${user.nom}` : user?.matricule}
          </Typography>
          <IconButton
            onClick={handleMenuOpen}
            size="small"
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              },
              '&:focus-visible': {
                outline: '2px solid rgba(255, 255, 255, 0.5)',
                outlineOffset: '2px'
              }
            }}
            aria-label="Menu utilisateur"
          >
            <Avatar
              sx={{
                width: { xs: 28, sm: 32 },
                height: { xs: 28, sm: 32 },
                bgcolor: 'var(--color-success)',
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
                border: '1px solid var(--border-light)'
              }
            }}
          >
            <MenuItem
              onClick={handleLogout}
              sx={{
                '&:hover': {
                  backgroundColor: 'var(--color-error-50)'
                },
                '&:focus': {
                  backgroundColor: 'var(--color-error-50)'
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
