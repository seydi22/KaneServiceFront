import { useState, useEffect } from 'react'
import { Box, Typography, TextField, MenuItem, Button as MuiButton, IconButton } from '@mui/material'
import { Search, FileDownload, PictureAsPdf } from '@mui/icons-material'
import { toast } from 'react-toastify'
import { formatCurrency, formatDateTime } from '../utils/format'
import { operationsService } from '../services/operations'
import { exportToExcel, exportToPDF } from '../utils/export'
import { SERVICES, CATEGORIES, CATEGORIES_LABELS, SERVICE_LABELS } from '../constants'
import Layout from '../components/layout/Layout'
import Table from '../components/common/Table'
import OperationModal from '../components/operations/OperationModal'
import ServiceLogo from '../components/common/ServiceLogo'
import { useAuth } from '../context/AuthContext'

const Operations = () => {
  const auth = useAuth()
  const isAgent = auth?.isAgent || false
  const [loading, setLoading] = useState(true)
  const [operations, setOperations] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalRows, setTotalRows] = useState(0)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    pays: '',
    pointService: '',
    agent: '',
    categorie: '',
    service: '',
    dateDebut: '',
    dateFin: '',
    recherche: ''
  })
  const [selectedServiceFilter, setSelectedServiceFilter] = useState('')

  const fetchOperations = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = {
        ...filters,
        page: page + 1,
        limit: rowsPerPage
      }
      const response = await operationsService.getAll(params)
      setOperations(response.data)
      setTotalRows(response.total)
    } catch (err) {
      console.error('Erreur fetchOperations:', err)
      setError('Erreur lors du chargement des opérations')
      toast.error('Erreur lors du chargement des opérations')
      setOperations([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOperations()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, filters.pays, filters.pointService, filters.agent, filters.categorie, filters.service, filters.dateDebut, filters.dateFin, filters.recherche])
  
  const handleServiceFilterChange = (service) => {
    setSelectedServiceFilter(service)
    setFilters({ ...filters, service, categorie: '' })
  }

  const handleExportExcel = () => {
    try {
      const exportData = operations.map(op => {
        // Déterminer le montant à afficher selon le type d'opération
        let montantDisplay = 'N/A'
        if (op.montantRecu && op.montantEnvoye) {
          montantDisplay = `Reçu: ${op.montantRecu} ${op.deviseRecu || 'XOF'} | Envoyé: ${op.montantEnvoye} ${op.deviseEnvoye || 'XOF'}`
        } else if (op.montant) {
          montantDisplay = `${op.montant} ${op.devise || 'XOF'}`
        }

        return {
          Date: formatDateTime(op.dateOperation || op.date),
          Service: SERVICE_LABELS[op.service] || op.service,
          Catégorie: CATEGORIES_LABELS[op.categorie] || op.categorie,
          Montant: montantDisplay,
          Agent: op.agent ? (typeof op.agent === 'object' ? `${op.agent.prenom} ${op.agent.nom}` : op.agent) : 'N/A',
          'Point Service': op.pointService ? (typeof op.pointService === 'object' ? op.pointService.nom : op.pointService) : 'N/A',
          Pays: op.pays,
          Commentaire: op.commentaire || ''
        }
      })
      exportToExcel(exportData, 'operations')
      toast.success('Export Excel réussi !')
    } catch (error) {
      toast.error('Erreur lors de l\'export Excel')
    }
  }

  const handleExportPDF = () => {
    try {
      const columns = [
        { key: 'date', label: 'Date' },
        { key: 'service', label: 'Service' },
        { key: 'categorie', label: 'Catégorie' },
        { key: 'montant', label: 'Montant' },
        { key: 'agent', label: 'Agent' },
        { key: 'pointService', label: 'Point Service' },
        { key: 'pays', label: 'Pays' }
      ]
      const exportData = operations.map(op => {
        // Déterminer le montant à afficher selon le type d'opération
        let montantDisplay = 'N/A'
        if (op.montantRecu && op.montantEnvoye) {
          montantDisplay = `Reçu: ${op.montantRecu} ${op.deviseRecu || 'XOF'} | Envoyé: ${op.montantEnvoye} ${op.deviseEnvoye || 'XOF'}`
        } else if (op.montant) {
          montantDisplay = `${op.montant} ${op.devise || 'XOF'}`
        }

        return {
          date: formatDateTime(op.dateOperation || op.date),
          service: SERVICE_LABELS[op.service] || op.service,
          categorie: CATEGORIES_LABELS[op.categorie] || op.categorie,
          montant: montantDisplay,
          agent: op.agent ? (typeof op.agent === 'object' ? `${op.agent.prenom} ${op.agent.nom}` : op.agent) : 'N/A',
          pointService: op.pointService ? (typeof op.pointService === 'object' ? op.pointService.nom : op.pointService) : 'N/A',
          pays: op.pays
        }
      })
      exportToPDF(exportData, columns, 'operations')
      toast.success('Export PDF réussi !')
    } catch (error) {
      toast.error('Erreur lors de l\'export PDF')
    }
  }

  const columns = [
    { key: 'date', label: 'Date', render: (row) => (row?.dateOperation || row?.date) ? formatDateTime(row.dateOperation || row.date) : 'N/A' },
    {
      key: 'service',
      label: 'Service',
      render: (row) => {
        if (!row) return 'N/A'
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ServiceLogo service={row.service} size={20} />
            <span>{SERVICE_LABELS[row.service] || row.service || 'N/A'}</span>
          </Box>
        )
      }
    },
    {
      key: 'categorie',
      label: 'Catégorie',
      render: (row) => row ? (CATEGORIES_LABELS[row.categorie] || row.categorie || 'N/A') : 'N/A'
    },
    {
      key: 'montant',
      label: 'Montant',
      render: (row) => {
        if (!row) return 'N/A'
        if (row.montantRecu && row.montantEnvoye) {
          return `${row.montantRecu} ${row.deviseRecu || 'XOF'} → ${row.montantEnvoye} ${row.deviseEnvoye || 'XOF'}`
        } else if (row.montant) {
          return `${row.montant} ${row.devise || 'XOF'}`
        }
        return 'N/A'
      }
    },
    { key: 'agent', label: 'Agent', render: (row) => (row.agent ? (typeof row.agent === 'object' ? `${row.agent.prenom} ${row.agent.nom}` : row.agent) : 'N/A') },
    { key: 'pointService', label: 'Point Service', render: (row) => (row.pointService ? (typeof row.pointService === 'object' ? row.pointService.nom : row.pointService) : 'N/A') },
    { key: 'pays', label: 'Pays', render: (row) => row?.pays || 'N/A' },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <IconButton size="small" onClick={() => toast.info(`Détails de l'opération ${row?.id || 'N/A'}`)}>
          <Search />
        </IconButton>
      )
    }
  ]

  // Vérifier que SERVICES est bien défini
  if (!SERVICES || Object.keys(SERVICES).length === 0) {
    return (
      <Layout>
        <Box>
          <Typography variant="h4" color="error">
            Erreur de configuration
          </Typography>
        </Box>
      </Layout>
    )
  }

  return (
    <Layout>
      <Box>
        {error && (
          <Box sx={{ mb: 2, p: 2, backgroundColor: 'var(--color-error-50)', borderRadius: 'var(--radius-md)', color: 'var(--color-error)' }}>
            <Typography>{error}</Typography>
          </Box>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight={700}>
            Opérations
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {isAgent && (
              <MuiButton
                variant="contained"
                onClick={() => setOpenModal(true)}
                sx={{ backgroundColor: 'var(--color-primary)' }}
              >
                Nouvelle Opération
              </MuiButton>
            )}
            <MuiButton
              variant="outlined"
              startIcon={<FileDownload />}
              onClick={handleExportExcel}
            >
              Excel
            </MuiButton>
            <MuiButton
              variant="outlined"
              startIcon={<PictureAsPdf />}
              onClick={handleExportPDF}
            >
              PDF
            </MuiButton>
          </Box>
        </Box>

        {/* Filtres */}
        <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Pays"
            select
            value={filters.pays}
            onChange={(e) => setFilters({ ...filters, pays: e.target.value })}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">Tous</MenuItem>
            <MenuItem value="Mauritanie">Mauritanie</MenuItem>
            <MenuItem value="Mali">Mali</MenuItem>
            <MenuItem value="Senegal">Sénégal</MenuItem>
          </TextField>
          <TextField
            label="Point de Service"
            value={filters.pointService}
            onChange={(e) => setFilters({ ...filters, pointService: e.target.value })}
            sx={{ minWidth: 200 }}
          />
          <TextField
            label="Agent"
            value={filters.agent}
            onChange={(e) => setFilters({ ...filters, agent: e.target.value })}
            sx={{ minWidth: 200 }}
          />
          <TextField
            label="Service"
            select
            value={filters.service}
            onChange={(e) => handleServiceFilterChange(e.target.value)}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="">Tous</MenuItem>
            {Object.values(SERVICES).map((serviceKey) => {
              if (!serviceKey) return null
              return (
                <MenuItem key={serviceKey} value={serviceKey}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ServiceLogo service={serviceKey} size={18} />
                    <span>{SERVICE_LABELS[serviceKey] || serviceKey}</span>
                  </Box>
                </MenuItem>
              )
            })}
          </TextField>
          <TextField
            label="Catégorie"
            select
            value={filters.categorie}
            onChange={(e) => setFilters({ ...filters, categorie: e.target.value })}
            disabled={!filters.service}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="">Toutes</MenuItem>
            {filters.service && CATEGORIES[filters.service]?.map((categorie) => (
              <MenuItem key={categorie} value={categorie}>
                {CATEGORIES_LABELS[categorie] || categorie}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Date Début"
            type="date"
            value={filters.dateDebut}
            onChange={(e) => setFilters({ ...filters, dateDebut: e.target.value })}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 150 }}
          />
          <TextField
            label="Date Fin"
            type="date"
            value={filters.dateFin}
            onChange={(e) => setFilters({ ...filters, dateFin: e.target.value })}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 150 }}
          />
          <TextField
            label="Recherche"
            value={filters.recherche}
            onChange={(e) => setFilters({ ...filters, recherche: e.target.value })}
            placeholder="Rechercher..."
            sx={{ minWidth: 200 }}
          />
        </Box>

        <Table
          columns={columns}
          data={operations}
          loading={loading}
          page={page}
          rowsPerPage={rowsPerPage}
          totalRows={totalRows}
          onPageChange={(e, newPage) => {
            if (newPage !== undefined) {
              setPage(newPage)
            }
          }}
          onRowsPerPageChange={(e) => {
            if (e && e.target && e.target.value) {
              setRowsPerPage(parseInt(e.target.value, 10))
              setPage(0)
            }
          }}
        />
      </Box>

      <OperationModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={() => {
          setOpenModal(false)
          fetchOperations()
          toast.success('Opération créée avec succès !')
        }}
      />
    </Layout>
  )
}

export default Operations
