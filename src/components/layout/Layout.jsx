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
          padding: { xs: 2, sm: 3 },
          marginTop: isAuthenticated ? { xs: '56px', sm: '64px' } : 0,
          marginLeft: isAuthenticated ? { xs: 0, md: 'var(--sidebar-width)' } : 0,
          minHeight: isAuthenticated ? 'calc(100vh - 64px)' : '100vh',
          backgroundColor: 'var(--bg-secondary)',
          transition: 'margin-left var(--transition-base)',
          width: isAuthenticated ? { xs: '100%', md: `calc(100% - var(--sidebar-width))` } : '100%'
        }}
      >
        {children}
      </Box>
    </Box>
  )
}

export default Layout
