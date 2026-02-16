import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Box, Container, Typography, Alert } from '@mui/material'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import Input from '../components/common/Input'
import Button from '../components/common/Button'

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    setError('')
    try {
      await login(data.matricule, data.password)
      const user = JSON.parse(localStorage.getItem('user'))
      if (user?.role === 'admin') {
        navigate('/dashboard/admin')
      } else {
        navigate('/dashboard/agent')
      }
      toast.success('Connexion réussie !')
    } catch (err) {
      const message = err.response?.data?.message || 'Erreur de connexion'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-secondary)',
        backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -20%, var(--color-primary-50) 0%, transparent 50%)',
        padding: { xs: 2, sm: 3 },
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            backgroundColor: 'var(--bg-primary)',
            padding: { xs: 3, sm: 4, md: 4.5 },
            borderRadius: 'var(--radius-2xl)',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid var(--border-light)',
            position: 'relative',
            overflow: 'hidden',
            animation: 'cardEnter 0.4s ease-out',
            '@keyframes cardEnter': {
              from: { opacity: 0, transform: 'translateY(12px)' },
              to: { opacity: 1, transform: 'translateY(0)' },
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'var(--color-primary)',
            },
          }}
        >
          <Box sx={{ textAlign: 'center', marginBottom: 4 }}>
            <Typography
              variant="h1"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2rem', sm: '2.25rem' },
                color: 'var(--color-primary)',
                marginBottom: 1,
                letterSpacing: '-0.03em',
              }}
            >
              KANE
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'var(--text-secondary)',
                fontWeight: 500,
                fontSize: { xs: '1rem', sm: '1.0625rem' },
              }}
            >
              Connexion à votre compte
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'var(--text-tertiary)',
                marginTop: 0.75,
                fontSize: '0.875rem',
              }}
            >
              Suivi des opérations financières
            </Typography>
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{
                marginBottom: 3,
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-error-50)',
                border: '1px solid var(--color-error)',
                '& .MuiAlert-icon': {
                  color: 'var(--color-error)'
                }
              }}
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Input
                label="Matricule"
                type="text"
                {...register('matricule', {
                  required: 'Matricule requis',
                  minLength: { value: 2, message: 'Minimum 2 caractères' }
                })}
                error={!!errors.matricule}
                helperText={errors.matricule?.message}
              />

              <Input
                label="Mot de passe"
                type="password"
                {...register('password', {
                  required: 'Mot de passe requis',
                  minLength: {
                    value: 6,
                    message: 'Minimum 6 caractères'
                  }
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                size="large"
                sx={{
                  marginTop: 1,
                  backgroundColor: 'var(--color-primary)',
                  borderRadius: '10px',
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: 'var(--color-primary-dark)',
                    boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)',
                  },
                }}
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </Box>
          </form>
        </Box>
      </Container>
    </Box>
  )
}

export default Login
