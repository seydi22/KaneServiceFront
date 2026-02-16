import { forwardRef } from 'react'
import { TextField } from '@mui/material'

// On utilise forwardRef pour que React Hook Form puisse attacher correctement le ref
const Input = forwardRef(({ label, error, helperText, ...props }, ref) => {
  return (
    <TextField
      label={label}
      error={error}
      helperText={helperText}
      fullWidth
      variant="outlined"
      inputRef={ref}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--bg-primary)',
          transition: 'all var(--transition-base)',
          '&:hover': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: error ? 'var(--color-error)' : 'var(--color-primary)',
              borderWidth: '2px'
            }
          },
          '&.Mui-focused': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: error ? 'var(--color-error)' : 'var(--color-primary)',
              borderWidth: '2px',
              boxShadow: error
                ? '0 0 0 3px rgba(239, 68, 68, 0.1)'
                : '0 0 0 3px rgba(37, 99, 235, 0.1)'
            }
          },
          '&.Mui-error': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--color-error)'
            }
          }
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: error ? 'var(--color-error)' : 'var(--border-medium)',
          transition: 'all var(--transition-base)'
        },
        '& .MuiInputLabel-root': {
          color: 'var(--text-secondary)',
          fontWeight: 500,
          '&.Mui-focused': {
            color: error ? 'var(--color-error)' : 'var(--color-primary)',
            fontWeight: 600
          },
          '&.Mui-error': {
            color: 'var(--color-error)'
          }
        },
        '& .MuiFormHelperText-root': {
          marginTop: '0.5rem',
          fontSize: '0.875rem',
          '&.Mui-error': {
            color: 'var(--color-error)'
          }
        },
        '& .MuiInputBase-input': {
          padding: '12px 16px',
          fontSize: '0.9375rem',
          color: 'var(--text-primary)',
          '&::placeholder': {
            color: 'var(--text-tertiary)',
            opacity: 1
          }
        }
      }}
      {...props}
    />
  )
})

Input.displayName = 'Input'

export default Input
