import { Box } from '@mui/material'
import { useAuth } from '../../context/AuthContext'
import Header from './Header'
import Sidebar from './Sidebar'

const Layout = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  // Ne pas afficher le Layout si l'utilisateur n'est pas authentifié
  if (!loading && !isAuthenticated) {
    return null
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-secondary)',
      }}
    >
      {isAuthenticated && <Header />}
      {/* Rangée sous l’AppBar fixe : menu + contenu (évite double marge / chevauchement) */}
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          minWidth: 0,
          minHeight: 0,
          marginTop: isAuthenticated ? { xs: '56px', sm: '64px' } : 0,
          backgroundColor: 'var(--bg-secondary)',
        }}
      >
        {isAuthenticated && <Sidebar />}
        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
            boxSizing: 'border-box',
            paddingTop: { xs: 2, sm: 2.5, md: 3 },
            paddingRight: { xs: 2, sm: 2.5, md: 3 },
            paddingBottom: { xs: 2, sm: 2.5, md: 3 },
            paddingLeft: { xs: 2, sm: 2.5, md: 5, lg: 6 },
            backgroundColor: 'var(--bg-secondary)',
            minHeight: isAuthenticated ? { xs: 'calc(100vh - 56px)', sm: 'calc(100vh - 64px)' } : '100vh',
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: 'var(--container-max-width)',
              marginLeft: 'auto',
              marginRight: 'auto',
              animation: 'fadeIn 0.3s ease-out',
              '@keyframes fadeIn': {
                from: { opacity: 0 },
                to: { opacity: 1 },
              },
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Layout
