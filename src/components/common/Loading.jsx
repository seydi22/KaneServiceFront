import { Box, CircularProgress, Typography } from '@mui/material'

const Loading = ({ message = 'Chargement...', fullScreen = false }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: fullScreen ? '100vh' : '400px',
        gap: 2,
        padding: 4
      }}
    >
      <CircularProgress
        size={fullScreen ? 60 : 50}
        sx={{
          color: 'var(--color-primary)',
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round'
          }
        }}
      />
      <Typography
        variant="body1"
        sx={{
          color: 'var(--text-secondary)',
          fontWeight: 500,
          fontSize: '0.9375rem'
        }}
      >
        {message}
      </Typography>
    </Box>
  )
}

export default Loading
