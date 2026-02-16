import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Box,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'
import {
  Dashboard,
  Receipt,
  Assessment,
  Business,
  People,
  ChevronLeft
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useSidebar } from '../../context/SidebarContext'

const drawerWidth = 240

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { mobileOpen, handleDrawerToggle } = useSidebar()
  const { isAdmin, isAgent, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return null
  }

  const menuItems = [
    ...(isAdmin
      ? [
          {
            text: 'Dashboard Admin',
            icon: <Dashboard />,
            path: '/dashboard/admin'
          },
          {
            text: 'Points de Service',
            icon: <Business />,
            path: '/points-service'
          },
          {
            text: 'Utilisateurs',
            icon: <People />,
            path: '/users'
          }
        ]
      : []),
    ...(isAgent
      ? [
          {
            text: 'Dashboard Agent',
            icon: <Dashboard />,
            path: '/dashboard/agent'
          }
        ]
      : []),
    {
      text: 'Opérations',
      icon: <Receipt />,
      path: '/operations'
    },
    {
      text: 'Rapports',
      icon: <Assessment />,
      path: '/reports'
    }
  ]

  const drawerContent = (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingX: 2,
          paddingY: 2,
          minHeight: { xs: '56px', sm: '64px' }
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            fontSize: '1rem',
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
          }}
        >
          Menu
        </Typography>
        {isMobile && (
          <IconButton
            onClick={handleDrawerToggle}
            sx={{
              color: 'var(--text-secondary)',
              '&:hover': {
                backgroundColor: 'var(--bg-tertiary)'
              }
            }}
            aria-label="Fermer le menu"
          >
            <ChevronLeft />
          </IconButton>
        )}
      </Box>
      <Divider sx={{ borderColor: 'var(--border-light)' }} />
      <List sx={{ paddingTop: 1, paddingX: 1 }}>
        {menuItems.map((item) => {
          const isSelected = location.pathname === item.path
          return (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                selected={isSelected}
                onClick={() => {
                  navigate(item.path)
                  if (isMobile) {
                    handleDrawerToggle()
                  }
                }}
                sx={{
                  borderRadius: 'var(--radius-lg)',
                  mb: 0.5,
                  paddingY: 1.25,
                  paddingX: 1.5,
                  transition: 'background-color 0.15s ease, color 0.15s ease',
                  '&.Mui-selected': {
                    backgroundColor: 'var(--color-primary-50)',
                    borderLeft: '3px solid var(--color-primary)',
                    '& .MuiListItemIcon-root': {
                      color: 'var(--color-primary)',
                    },
                    '& .MuiListItemText-primary': {
                      color: 'var(--color-primary)',
                      fontWeight: 600,
                    },
                    '&:hover': {
                      backgroundColor: 'var(--color-primary-100)',
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'var(--bg-tertiary)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isSelected ? 'var(--color-primary)' : 'var(--text-secondary)',
                    minWidth: 40,
                    transition: 'color var(--transition-fast)'
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.9375rem',
                    fontWeight: isSelected ? 600 : 500,
                    letterSpacing: '0.01em'
                  }}
                />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
    </>
  )

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true // Better mobile performance
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          zIndex: (theme) => theme.zIndex.drawer - 1,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: 'var(--bg-primary)',
            borderRight: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-xl)',
            top: { xs: '56px', sm: '64px' },
            height: { xs: 'calc(100vh - 56px)', sm: 'calc(100vh - 64px)' }
          }
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: 'var(--bg-primary)',
            borderRight: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-sm)',
            position: 'fixed',
            top: { xs: '56px', sm: '64px' },
            height: { xs: 'calc(100vh - 56px)', sm: 'calc(100vh - 64px)' },
            overflowY: 'auto',
            zIndex: (theme) => theme.zIndex.drawer,
            '&::-webkit-scrollbar': {
              width: '8px'
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'var(--bg-tertiary)'
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'var(--color-gray-400)',
              borderRadius: 'var(--radius-full)'
            }
          }
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  )
}

export default Sidebar
