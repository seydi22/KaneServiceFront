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
      await login(data.email, data.password)
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
        backgroundImage: 'radial-gradient(circle at 20% 50%, var(--color-primary-50) 0%, transparent 50%), radial-gradient(circle at 80% 80%, var(--color-purple-50) 0%, transparent 50%)',
        padding: { xs: 2, sm: 3 }
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            backgroundColor: 'var(--bg-primary)',
            padding: { xs: 3, sm: 4, md: 5 },
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid var(--border-light)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-purple) 100%)'
            }
          }}
        >
          <Box sx={{ textAlign: 'center', marginBottom: 4 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2rem', sm: '2.5rem' },
                background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-purple) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: 1,
                letterSpacing: '-0.02em'
              }}
            >
              KANE
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'var(--text-secondary)',
                fontWeight: 500,
                fontSize: { xs: '1rem', sm: '1.125rem' }
              }}
            >
              Connexion à votre compte
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'var(--text-tertiary)',
                marginTop: 1,
                fontSize: '0.875rem'
              }}
            >
              Gestion des opérations financières
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
                label="Email"
                type="email"
                {...register('email', {
                  required: 'Email requis',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email invalide'
                  }
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
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
                  background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)'
                  }
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
