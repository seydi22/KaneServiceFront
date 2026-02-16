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
        minHeight: '100vh',
        backgroundColor: 'var(--bg-secondary)'
      }}
    >
      {isAuthenticated && (
        <>
          <Header />
          <Sidebar />
        </>
      )}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          padding: { xs: 2, sm: 2, md: 2.5 },
          marginTop: isAuthenticated ? { xs: '56px', sm: '64px' } : 0,
          marginLeft: isAuthenticated ? { xs: 0, md: 'var(--sidebar-width)' } : 0,
          minHeight: isAuthenticated ? 'calc(100vh - 64px)' : '100vh',
          backgroundColor: 'var(--bg-secondary)',
          transition: 'margin-left 0.2s ease',
          width: isAuthenticated ? { xs: '100%', md: `calc(100% - var(--sidebar-width))` } : '100%',
          maxWidth: isAuthenticated ? 'none' : '100%',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 1280,
            margin: 0,
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
  )
}

export default Layout
