import {
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  CircularProgress,
  Box,
  Typography
} from '@mui/material'

const Table = ({
  columns,
  data,
  loading = false,
  page = 0,
  rowsPerPage = 10,
  totalRows = 0,
  onPageChange,
  onRowsPerPageChange
}) => {
  // Fonction helper pour convertir une valeur en string si c'est un objet
  const renderCellValue = (value) => {
    if (value === null || value === undefined) {
      return 'N/A'
    }
    if (typeof value === 'object' && !Array.isArray(value)) {
      // Si c'est un objet, essayer d'afficher une propriété pertinente (nom, name, etc.)
      return value.nom || value.name || value._id || JSON.stringify(value)
    }
    return value
  }

  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--border-light)',
        overflowX: 'auto',
        '&::-webkit-scrollbar': {
          height: '8px'
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'var(--bg-tertiary)'
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'var(--color-gray-400)',
          borderRadius: 'var(--radius-full)'
        }
      }}
    >
      <MuiTable sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: 'var(--bg-tertiary)',
              '& .MuiTableCell-head': {
                borderBottom: '2px solid var(--border-light)'
              }
            }}
          >
            {columns.map((column) => (
              <TableCell
                key={column.key}
                sx={{
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  color: 'var(--text-primary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  padding: { xs: 1.5, sm: 2 }
                }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length} align="center" sx={{ padding: 6 }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2
                  }}
                >
                  <CircularProgress size={40} sx={{ color: 'var(--color-primary)' }} />
                  <Typography variant="body2" color="text.secondary">
                    Chargement...
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                align="center"
                sx={{
                  padding: 6,
                  color: 'var(--text-secondary)'
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <Typography variant="body1" fontWeight={500}>
                    Aucune donnée disponible
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Les données apparaîtront ici une fois disponibles
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => (
              <TableRow
                key={row.id || index}
                hover
                sx={{
                  '&:hover': {
                    backgroundColor: 'var(--bg-tertiary)'
                  },
                  '&:last-child td': {
                    borderBottom: 'none'
                  },
                  transition: 'background-color var(--transition-fast)'
                }}
              >
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    sx={{
                      padding: { xs: 1.5, sm: 2 },
                      fontSize: '0.9375rem',
                      color: 'var(--text-primary)',
                      borderBottom: '1px solid var(--border-light)'
                    }}
                  >
                    {column.render ? column.render(row) : renderCellValue(row[column.key])}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </MuiTable>
      {totalRows > 0 && (
        <TablePagination
          component="div"
          count={totalRows}
          page={page}
          onPageChange={onPageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={onRowsPerPageChange}
          rowsPerPageOptions={[10, 25, 50, 100]}
          labelRowsPerPage="Lignes par page:"
        />
      )}
    </TableContainer>
  )
}

export default Table
