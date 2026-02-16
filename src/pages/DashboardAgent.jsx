import { useState, useEffect, useCallback } from 'react'
import { Box, Grid, Typography, Button as MuiButton, TextField, MenuItem } from '@mui/material'
import { AddCircle } from '@mui/icons-material'
import { toast } from 'react-toastify'
import { formatDate } from '../utils/format'
import { dashboardService } from '../services/dashboard'
import { SERVICES, CATEGORIES, CATEGORIES_LABELS, SERVICE_LABELS } from '../constants'
import Layout from '../components/layout/Layout'
import StatCard from '../components/dashboard/StatCard'
import { PieChartCard } from '../components/dashboard/Charts'
import Table from '../components/common/Table'
import OperationModal from '../components/operations/OperationModal'
import ServiceLogo from '../components/common/ServiceLogo'
import { Receipt, AttachMoney } from '@mui/icons-material'

const DashboardAgent = () => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [openModal, setOpenModal] = useState(false)
  const [filters, setFilters] = useState({
    date: new Date().toISOString().split('T')[0],
    service: '',
    categorie: ''
  })
  const [selectedServiceFilter, setSelectedServiceFilter] = useState('')

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const response = await dashboardService.getAgentDashboard(filters)
      setData(response)
    } catch (error) {
      toast.error('Erreur lors du chargement des données')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Écouter les événements de création d'opération pour rafraîchir les données
  useEffect(() => {
    const handleOperationCreated = () => {
      fetchData()
    }

    window.addEventListener('operationCreated', handleOperationCreated)

    return () => {
      window.removeEventListener('operationCreated', handleOperationCreated)
    }
  }, [fetchData])
  
  const handleServiceFilterChange = (service) => {
    setSelectedServiceFilter(service)
    setFilters({ ...filters, service, categorie: '' })
  }

  const handleOperationCreated = () => {
    setOpenModal(false)
    fetchData()
    toast.success('Opération créée avec succès !')
  }

  const columns = [
    { key: 'date', label: 'Date', render: (row) => formatDate(row.dateOperation || row.date) },
    {
      key: 'service',
      label: 'Service',
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ServiceLogo service={row.service} size={20} />
          <span>{SERVICE_LABELS[row.service] || row.service}</span>
        </Box>
      )
    },
    {
      key: 'categorie',
      label: 'Catégorie',
      render: (row) => CATEGORIES_LABELS[row.categorie] || row.categorie || 'N/A'
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
    { key: 'commentaire', label: 'Commentaire' }
  ]

  return (
    <Layout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight={700}>
            Dashboard Agent
          </Typography>
          <MuiButton
            variant="contained"
            startIcon={<AddCircle />}
            onClick={() => setOpenModal(true)}
            sx={{
              backgroundColor: 'var(--color-primary)',
              '&:hover': { backgroundColor: 'var(--color-primary-dark)' }
            }}
          >
            Nouvelle Opération
          </MuiButton>
        </Box>

        {/* Filtres */}
        <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
          <TextField
            label="Date"
            type="date"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 200 }}
          />
          <TextField
            label="Service"
            select
            value={filters.service}
            onChange={(e) => handleServiceFilterChange(e.target.value)}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">Tous</MenuItem>
            {Object.values(SERVICES).map((serviceKey) => (
              <MenuItem key={serviceKey} value={serviceKey}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ServiceLogo service={serviceKey} size={18} />
                  <span>{SERVICE_LABELS[serviceKey]}</span>
                </Box>
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Catégorie"
            select
            value={filters.categorie}
            onChange={(e) => setFilters({ ...filters, categorie: e.target.value })}
            disabled={!filters.service}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">Toutes</MenuItem>
            {filters.service && CATEGORIES[filters.service]?.map((categorie) => (
              <MenuItem key={categorie} value={categorie}>
                {CATEGORIES_LABELS[categorie] || categorie}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {/* Cards statistiques */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Opérations (période)"
              value={data?.totalOperations ?? 0}
              icon={<Receipt sx={{ color: 'var(--color-primary)', fontSize: 32 }} />}
              color="var(--color-primary)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total FCFA"
              value={
                data?.montantTotalFcfa != null
                  ? `${new Intl.NumberFormat('fr-FR').format(data.montantTotalFcfa)} F CFA`
                  : '0 F CFA'
              }
              icon={<AttachMoney sx={{ color: 'var(--color-success)', fontSize: 32 }} />}
              color="var(--color-success)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Ouguiya (MRU)"
              value={
                data?.montantTotalOuguiya != null
                  ? `${new Intl.NumberFormat('fr-FR').format(data.montantTotalOuguiya)} MRU`
                  : '0 MRU'
              }
              icon={<AttachMoney sx={{ color: 'var(--color-warning)', fontSize: 32 }} />}
              color="var(--color-warning)"
            />
          </Grid>
        </Grid>

        {/* Résumé par service et par type (FCFA + Ouguiya) */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {data?.parService?.length > 0 && (
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                Montants par service (FCFA / Ouguiya)
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {data.parService.map((s) => (
                  <Box
                    key={s._id}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 1,
                      px: 2,
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-light)',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ServiceLogo service={s.nom} size={20} />
                      <span>{SERVICE_LABELS[s.nom] || s.nom}</span>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                      <Typography variant="body2" fontWeight={600} color="var(--color-success)">
                        {(s.totalFcfa ?? 0) > 0 ? `${new Intl.NumberFormat('fr-FR').format(s.totalFcfa)} F CFA` : '-'}
                      </Typography>
                      <Typography variant="body2" fontWeight={600} color="var(--color-warning)">
                        {(s.totalOuguiya ?? 0) > 0 ? `${new Intl.NumberFormat('fr-FR').format(s.totalOuguiya)} MRU` : '-'}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Grid>
          )}
          {data?.parType?.length > 0 && (
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                Montants par type (FCFA / Ouguiya)
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {data.parType.map((t) => (
                  <Box
                    key={t._id}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 1,
                      px: 2,
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-light)',
                    }}
                  >
                    <span>{CATEGORIES_LABELS[t.nom] || t.nom}</span>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                      <Typography variant="body2" fontWeight={600} color="var(--color-success)">
                        {(t.totalFcfa ?? 0) > 0 ? `${new Intl.NumberFormat('fr-FR').format(t.totalFcfa)} F CFA` : '-'}
                      </Typography>
                      <Typography variant="body2" fontWeight={600} color="var(--color-warning)">
                        {(t.totalOuguiya ?? 0) > 0 ? `${new Intl.NumberFormat('fr-FR').format(t.totalOuguiya)} MRU` : '-'}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Grid>
          )}
        </Grid>

        {/* Graphiques FCFA / Ouguiya par service */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {data?.parService?.length > 0 && data.parService.some((s) => (s.totalFcfa ?? 0) > 0) && (
            <Grid item xs={12} md={6}>
              <PieChartCard
                title="Répartition FCFA par service"
                data={(data.parService || [])
                  .filter((s) => (s.totalFcfa ?? 0) > 0)
                  .map((s) => ({ ...s, nom: SERVICE_LABELS[s.nom] || s.nom }))}
                dataKey="totalFcfa"
                nameKey="nom"
              />
            </Grid>
          )}
          {data?.parService?.length > 0 && data.parService.some((s) => (s.totalOuguiya ?? 0) > 0) && (
            <Grid item xs={12} md={6}>
              <PieChartCard
                title="Répartition Ouguiya (MRU) par service"
                data={(data.parService || [])
                  .filter((s) => (s.totalOuguiya ?? 0) > 0)
                  .map((s) => ({ ...s, nom: SERVICE_LABELS[s.nom] || s.nom }))}
                dataKey="totalOuguiya"
                nameKey="nom"
              />
            </Grid>
          )}
        </Grid>

        {/* Dernières opérations */}
        <Box>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            Dernières Opérations
          </Typography>
          <Table
            columns={columns}
            data={data?.dernieresOperations || []}
            loading={loading}
          />
        </Box>
      </Box>

      <OperationModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={handleOperationCreated}
      />
    </Layout>
  )
}

export default DashboardAgent
