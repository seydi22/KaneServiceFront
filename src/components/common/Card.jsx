import { Card as MuiCard, CardContent, Typography, Box } from '@mui/material'

const Card = ({ title, children, sx, elevation = 1, ...props }) => {
  const elevationShadows = {
    0: 'none',
    1: 'var(--shadow-sm)',
    2: 'var(--shadow-md)',
    3: 'var(--shadow-lg)',
    4: 'var(--shadow-xl)'
  }

  return (
    <MuiCard
      sx={{
        borderRadius: 'var(--radius-lg)',
        boxShadow: elevationShadows[elevation] || elevationShadows[1],
        backgroundColor: 'var(--bg-primary)',
        border: '1px solid var(--border-light)',
        transition: 'all var(--transition-base)',
        '&:hover': {
          boxShadow: elevation > 0 ? 'var(--shadow-md)' : 'var(--shadow-sm)',
          transform: elevation > 0 ? 'translateY(-2px)' : 'none'
        },
        ...sx
      }}
      {...props}
    >
      {title && (
        <Box
          sx={{
            padding: { xs: 2, sm: 3 },
            paddingBottom: { xs: 1, sm: 2 },
            borderBottom: '1px solid var(--border-light)'
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '1.125rem', sm: '1.25rem' },
              color: 'var(--text-primary)',
              letterSpacing: '-0.01em'
            }}
          >
            {title}
          </Typography>
        </Box>
      )}
      <CardContent
        sx={{
          padding: { xs: 2, sm: 3 },
          '&:last-child': {
            paddingBottom: { xs: 2, sm: 3 }
          }
        }}
      >
        {children}
      </CardContent>
    </MuiCard>
  )
}

export default Card
