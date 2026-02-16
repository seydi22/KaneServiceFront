import { Box } from '@mui/material'
import {
  AccountBalanceWallet,
  Payment,
  CurrencyExchange,
  Tv
} from '@mui/icons-material'
import { SERVICE_LABELS } from '../../constants'

const SERVICE_ICONS = {
  'Orange_Money': AccountBalanceWallet,
  'Wave': Payment,
  'Change': CurrencyExchange,
  'Canal_Plus': Tv
}

const SERVICE_COLORS = {
  'Orange_Money': '#FF6600',
  'Wave': '#00D9FF',
  'Change': '#10B981',
  'Canal_Plus': '#000000'
}

const ServiceLogo = ({ service, size = 24, showLabel = false }) => {
  if (!service) return null

  // Normaliser le nom du service (gérer les variations)
  const normalizedService = service.replace(/\s+/g, '_')
  
  const Icon = SERVICE_ICONS[normalizedService] || SERVICE_ICONS[service]
  const color = SERVICE_COLORS[normalizedService] || SERVICE_COLORS[service]

  if (!Icon) return null

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: size + 8,
          height: size + 8,
          borderRadius: 'var(--radius-md)',
          backgroundColor: `${color}15`,
          color: color,
          transition: 'all var(--transition-base)',
          '&:hover': {
            backgroundColor: `${color}25`,
            transform: 'scale(1.05)'
          }
        }}
      >
        <Icon sx={{ fontSize: size }} />
      </Box>
      {showLabel && (
        <Box
          component="span"
          sx={{
            fontSize: '0.9375rem',
            fontWeight: 500,
            color: 'var(--text-primary)'
          }}
        >
          {SERVICE_LABELS[service] || SERVICE_LABELS[normalizedService] || service.replace(/_/g, ' ')}
        </Box>
      )}
    </Box>
  )
}

export default ServiceLogo
