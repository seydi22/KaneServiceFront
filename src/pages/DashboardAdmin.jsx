import { useState, useEffect, useCallback } from 'react'
import { Box, Grid, Typography, TextField, MenuItem, Paper, InputAdornment } from '@mui/material'
import { toast } from 'react-toastify'
import { formatCurrency } from '../utils/format'
import { dashboardService } from '../services/dashboard'
import Layout from '../components/layout/Layout'
import StatCard from '../components/dashboard/StatCard'
import { LineChartCard, BarChartCard, PieChartCard } from '../components/dashboard/Charts'
import { Receipt, AttachMoney, Business, People, Search, Tune } from '@mui/icons-material'

const DashboardAdmin = () => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [filters, setFilters] = useState({
    pays: '',
    dateDebut: new Date().toISOString().split('T')[0],
    dateFin: new Date().toISOString().split('T')[0],
    pointService: '',
    agent: ''
  })

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const response = await dashboardService.getAdminDashboard(filters)
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

  return (
    <Layout>
      <Box>
        <Box sx={{ mb: 2.25, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: '-0.03em' }}>
              Dashboard Admin
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mt: 0.5 }}>
              Vue globale des opérations et des montants (FCFA / Ouguiya)
            </Typography>
          </Box>
        </Box>

        {/* Filtres avancés */}
        <Paper
          variant="outlined"
          sx={{
            mb: 3,
            p: { xs: 1.5, sm: 2 },
            borderRadius: 'var(--radius-xl)',
            borderColor: 'var(--border-light)',
            backgroundImage:
              'radial-gradient(1200px 600px at 20% -20%, rgba(13, 148, 136, 0.08), transparent 50%), radial-gradient(900px 500px at 80% 0%, rgba(37, 99, 235, 0.06), transparent 45%)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Tune sx={{ color: 'var(--text-secondary)' }} />
            <Typography variant="subtitle2" sx={{ letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
              Filtres
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
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
            label="Point de Service"
            value={filters.pointService}
            onChange={(e) => setFilters({ ...filters, pointService: e.target.value })}
            sx={{ minWidth: 200 }}
            placeholder="Rechercher…"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: 'var(--text-tertiary)' }} />
                </InputAdornment>
              )
            }}
          />
          <TextField
            label="Agent"
            value={filters.agent}
            onChange={(e) => setFilters({ ...filters, agent: e.target.value })}
            sx={{ minWidth: 200 }}
            placeholder="Rechercher…"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: 'var(--text-tertiary)' }} />
                </InputAdornment>
              )
            }}
          />
          </Box>
        </Paper>

        {/* Cards statistiques */}
        <Grid container spacing={3} sx={{ mb: 3 }} alignItems="stretch">
          <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
            <StatCard
              title="Total Opérations"
              value={data?.totalOperations || 0}
              icon={<Receipt sx={{ color: 'var(--color-primary-light)', fontSize: 32 }} />}
              color="var(--color-primary)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
            <StatCard
              title="Montant total FCFA"
              value={
                data?.montantTotalFcfa != null
                  ? `${new Intl.NumberFormat('fr-FR').format(data.montantTotalFcfa)} F CFA`
                  : '0 F CFA'
              }
              icon={<AttachMoney sx={{ color: 'var(--color-success)', fontSize: 32 }} />}
              color="var(--color-success)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
            <StatCard
              title="Montant total Ouguiya (MRU)"
              value={
                data?.montantTotalOuguiya != null
                  ? `${new Intl.NumberFormat('fr-FR').format(data.montantTotalOuguiya)} MRU`
                  : '0 MRU'
              }
              icon={<AttachMoney sx={{ color: 'var(--color-info)', fontSize: 32 }} />}
              color="var(--color-info, #2196f3)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
            <StatCard
              title="Points de Service"
              value={data?.totalPointsService || 0}
              icon={<Business sx={{ color: 'var(--color-warning)', fontSize: 32 }} />}
              color="var(--color-warning)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
            <StatCard
              title="Agents Actifs"
              value={data?.totalAgentsActifs || 0}
              icon={<People sx={{ color: 'var(--color-purple)', fontSize: 32 }} />}
              color="var(--color-purple)"
            />
          </Grid>
        </Grid>

        {/* Top 5 Points de Service */}
        {data?.topPointsService && data.topPointsService.length > 0 && (
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Paper
                variant="outlined"
                sx={{
                  p: 2.25,
                  borderRadius: 'var(--radius-xl)',
                  borderColor: 'var(--border-light)',
                  backgroundColor: 'rgba(148, 163, 184, 0.04)',
                }}
              >
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Top 5 Points de Service
                </Typography>
                {data.topPointsService.map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: index < 4 ? '1px solid var(--border-light)' : 'none' }}>
                    <Typography>{item.nom}</Typography>
                    <Typography fontWeight={600}>{formatCurrency(item.value)}</Typography>
                  </Box>
                ))}
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper
                variant="outlined"
                sx={{
                  p: 2.25,
                  borderRadius: 'var(--radius-xl)',
                  borderColor: 'var(--border-light)',
                  backgroundColor: 'rgba(148, 163, 184, 0.04)',
                }}
              >
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Top 5 Agents
                </Typography>
                {data.topAgents?.map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: index < 4 ? '1px solid var(--border-light)' : 'none' }}>
                    <Typography>{item.nom}</Typography>
                    <Typography fontWeight={600}>{formatCurrency(item.value)}</Typography>
                  </Box>
                ))}
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* Graphiques */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {data?.evolutionTemporelle && (
            <Grid item xs={12}>
              <LineChartCard
                title="Évolution Temporelle"
                data={data.evolutionTemporelle}
                dataKey="montant"
                xKey="date"
              />
            </Grid>
          )}
          {data?.parService && (
            <Grid item xs={12} md={6}>
              <PieChartCard
                title="Répartition par Service"
                data={data.parService}
                dataKey="value"
                nameKey="nom"
              />
            </Grid>
          )}
          {data?.parType && (
            <Grid item xs={12} md={6}>
              <BarChartCard
                title="Répartition par Type"
                data={data.parType}
                dataKey="value"
                xKey="nom"
              />
            </Grid>
          )}
          {data?.parPays && (
            <Grid item xs={12}>
              <BarChartCard
                title="Répartition par Pays"
                data={data.parPays}
                dataKey="value"
                xKey="nom"
              />
            </Grid>
          )}
        </Grid>
      </Box>
    </Layout>
  )
}

export default DashboardAdmin
