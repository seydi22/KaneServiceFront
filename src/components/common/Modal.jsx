import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Box, Divider } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

const Modal = ({ open, onClose, title, children, actions, maxWidth = 'sm' }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-2xl)',
          border: '1px solid var(--border-light)',
          overflow: 'hidden'
        }
      }}
      BackdropProps={{
        sx: {
          backgroundColor: 'var(--bg-overlay)',
          backdropFilter: 'blur(4px)'
        }
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: { xs: 2, sm: 3 },
          paddingBottom: 2,
          borderBottom: '1px solid var(--border-light)',
          backgroundColor: 'var(--bg-tertiary)'
        }}
      >
        <Box
          component="h2"
          sx={{
            margin: 0,
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.01em'
          }}
        >
          {title}
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: 'var(--text-secondary)',
            '&:hover': {
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-primary)'
            },
            '&:focus-visible': {
              outline: '2px solid var(--color-primary)',
              outlineOffset: '2px'
            },
            transition: 'all var(--transition-fast)'
          }}
          aria-label="Fermer"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          padding: { xs: 2, sm: 3 },
          '&.MuiDialogContent-root': {
            paddingTop: { xs: 2, sm: 3 }
          }
        }}
      >
        {children}
      </DialogContent>
      {actions && (
        <>
          <Divider sx={{ borderColor: 'var(--border-light)' }} />
          <DialogActions
            sx={{
              padding: { xs: 2, sm: 3 },
              paddingTop: 2,
              gap: 1.5,
              justifyContent: 'flex-end',
              flexWrap: 'wrap'
            }}
          >
            {actions}
          </DialogActions>
        </>
      )}
    </Dialog>
  )
}

export default Modal
