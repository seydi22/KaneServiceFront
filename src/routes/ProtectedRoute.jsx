import { Navigate } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children, adminOnly = false, agentOnly = false }) => {
  const { isAuthenticated, isAdmin, isAgent, loading } = useAuth()

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh'
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (adminOnly && !isAdmin) {
    if (isAgent) {
      return <Navigate to="/dashboard/agent" replace />
    }
    // Évite boucle admin ⟷ agent si le rôle n’est pas reconnu (ex. frontend non à jour).
    return <Navigate to="/login" replace />
  }

  if (agentOnly && !isAgent) {
    if (isAdmin) {
      return <Navigate to="/dashboard/admin" replace />
    }
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
