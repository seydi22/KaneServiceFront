import { Button as MuiButton } from '@mui/material'

const Button = ({ children, variant = 'contained', color = 'primary', size = 'medium', ...props }) => {
  const sizeStyles = {
    small: {
      padding: '6px 16px',
      fontSize: '0.875rem',
      minHeight: '32px'
    },
    medium: {
      padding: '10px 24px',
      fontSize: '0.9375rem',
      minHeight: '40px'
    },
    large: {
      padding: '12px 32px',
      fontSize: '1rem',
      minHeight: '48px'
    }
  }

  return (
    <MuiButton
      variant={variant}
      color={color}
      size={size}
      sx={{
        textTransform: 'none',
        borderRadius: 'var(--radius-md)',
        fontWeight: 600,
        boxShadow: variant === 'contained' ? 'var(--shadow-sm)' : 'none',
        transition: 'all var(--transition-base)',
        '&:hover': {
          boxShadow: variant === 'contained' ? 'var(--shadow-md)' : 'none',
          transform: 'translateY(-1px)'
        },
        '&:active': {
          transform: 'translateY(0)'
        },
        '&:focus-visible': {
          outline: '2px solid var(--color-primary)',
          outlineOffset: '2px'
        },
        '&.Mui-disabled': {
          opacity: 0.6,
          cursor: 'not-allowed'
        },
        ...sizeStyles[size],
        ...props.sx
      }}
      {...props}
    >
      {children}
    </MuiButton>
  )
}

export default Button
