import React from 'react'
import { Box, Typography, Button } from '@mui/material'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            p: 3
          }}
        >
          <Typography variant="h5" color="error" gutterBottom>
            Une erreur s'est produite
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {this.state.error?.message || 'Erreur inconnue'}
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              this.setState({ hasError: false, error: null })
              window.location.reload()
            }}
          >
            Recharger la page
          </Button>
        </Box>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
