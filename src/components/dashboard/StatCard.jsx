import { Card, CardContent, Typography, Box } from '@mui/material'
import { TrendingUp, TrendingDown } from '@mui/icons-material'

const StatCard = ({ title, value, subtitle, trend, icon, color = 'var(--color-primary)' }) => {
  return (
    <Card
      sx={{
        width: '100%',
        height: '100%',
        border: '1px solid var(--border-light)',
        borderLeft: `4px solid ${color}`,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 18px 50px rgba(0, 0, 0, 0.28)',
        backgroundImage:
          `radial-gradient(1200px 600px at 20% -20%, ${color}1A, transparent 50%), radial-gradient(900px 500px at 80% 0%, rgba(37, 99, 235, 0.06), transparent 45%)`,
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
        '&:hover': {
          boxShadow: '0 24px 70px rgba(0, 0, 0, 0.36)',
          transform: 'translateY(-2px)',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: '120px',
          height: '120px',
          background: `linear-gradient(135deg, ${color}12 0%, transparent 100%)`,
          borderRadius: '0 0 0 120px',
          pointerEvents: 'none',
        },
      }}
    >
      <CardContent sx={{ position: 'relative', zIndex: 1, padding: { xs: 2, sm: 2.5 } }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 2
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{
                color: 'var(--text-secondary)',
                fontWeight: 500,
                fontSize: '0.875rem',
                marginBottom: 1,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h4"
              sx={{
                color,
                fontWeight: 700,
                fontSize: { xs: '1.5rem', sm: '1.875rem' },
                lineHeight: 1.2,
                marginBottom: subtitle ? 1 : 0
              }}
            >
              {value}
            </Typography>
            {subtitle && (
              <Typography
                variant="body2"
                sx={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.875rem',
                  marginTop: 0.5
                }}
              >
                {subtitle}
              </Typography>
            )}
            {trend && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  marginTop: 1.5,
                  gap: 0.5
                }}
              >
                {trend > 0 ? (
                  <TrendingUp
                    sx={{
                      color: 'var(--color-success)',
                      fontSize: 18
                    }}
                  />
                ) : (
                  <TrendingDown
                    sx={{
                      color: 'var(--color-error)',
                      fontSize: 18
                    }}
                  />
                )}
                <Typography
                  variant="body2"
                  sx={{
                    color: trend > 0 ? 'var(--color-success)' : 'var(--color-error)',
                    fontWeight: 600,
                    fontSize: '0.875rem'
                  }}
                >
                  {Math.abs(trend)}%
                </Typography>
              </Box>
            )}
          </Box>
          {icon && (
            <Box
              sx={{
                backgroundColor: `${color}18`,
                borderRadius: 'var(--radius-lg)',
                padding: { xs: 1.5, sm: 2 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'transform var(--transition-base)',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
            >
              {icon}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

export default StatCard
