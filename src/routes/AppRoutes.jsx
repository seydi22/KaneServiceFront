import { Routes, Route, Navigate } from 'react-router-dom'
import { Box, CircularProgress, Typography } from '@mui/material'
import { useAuth } from '../context/AuthContext'
import ProtectedRoute from './ProtectedRoute'
import Login from '../pages/Login'
import DashboardAgent from '../pages/DashboardAgent'
import DashboardAdmin from '../pages/DashboardAdmin'
import Operations from '../pages/Operations'
import Reports from '../pages/Reports'
import PointsService from '../pages/PointsService'
import Users from '../pages/Users'

const AppRoutes = () => {
  const { isAuthenticated, isAdmin, isAgent, loading } = useAuth()

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          gap: 2,
          backgroundColor: 'var(--bg-secondary)'
        }}
      >
        <CircularProgress size={50} sx={{ color: 'var(--color-primary)' }} />
        <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
          Chargement...
        </Typography>
      </Box>
    )
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to={isAdmin ? '/dashboard/admin' : '/dashboard/agent'} replace /> : <Login />}
      />
      <Route
        path="/dashboard/agent"
        element={
          <ProtectedRoute agentOnly>
            <DashboardAgent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/admin"
        element={
          <ProtectedRoute adminOnly>
            <DashboardAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/operations"
        element={
          <ProtectedRoute>
            <Operations />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/points-service"
        element={
          <ProtectedRoute adminOnly>
            <PointsService />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute adminOnly>
            <Users />
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={
          <Navigate
            to={isAuthenticated ? (isAdmin ? '/dashboard/admin' : '/dashboard/agent') : '/login'}
            replace
          />
        }
      />
    </Routes>
  )
}

export default AppRoutes
