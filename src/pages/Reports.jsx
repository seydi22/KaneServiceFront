import { useState, useEffect } from 'react'
import { Box, Typography, Tabs, Tab, TextField, MenuItem, Button as MuiButton, Grid } from '@mui/material'
import { FileDownload, PictureAsPdf } from '@mui/icons-material'
import { toast } from 'react-toastify'
import { formatCurrency } from '../utils/format'
import { reportsService } from '../services/reports'
import { exportToExcel, exportToPDF } from '../utils/export'
import Layout from '../components/layout/Layout'
import StatCard from '../components/dashboard/StatCard'
import { LineChartCard, BarChartCard, PieChartCard } from '../components/dashboard/Charts'
import { Receipt, AttachMoney } from '@mui/icons-material'

const Reports = () => {
  const [tab, setTab] = useState(0)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [filters, setFilters] = useState({
    date: new Date().toISOString().split('T')[0],
    weekStart: new Date().toISOString().split('T')[0],
    weekEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  })

  const fetchData = async () => {
    setLoading(true)
    try {
      let response
      if (tab === 0) {
        response = await reportsService.getJournalier(filters.date)
      } else if (tab === 1) {
        response = await reportsService.getHebdomadaire(filters.weekStart, filters.weekEnd)
      } else {
        response = await reportsService.getMensuel(filters.month, filters.year)
      }
      setData(response)
    } catch (error) {
      toast.error('Erreur lors du chargement des rapports')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [tab, filters])

  const handleExportExcel = () => {
    try {
      const exportData = data?.operations?.map(op => {
        // Déterminer le montant à afficher selon le type d'opération
        let montantDisplay = 'N/A'
        if (op.montantRecu && op.montantEnvoye) {
          montantDisplay = `Reçu: ${op.montantRecu} ${op.deviseRecu || 'XOF'} | Envoyé: ${op.montantEnvoye} ${op.deviseEnvoye || 'XOF'}`
        } else if (op.montant) {
          montantDisplay = `${op.montant} ${op.devise || 'XOF'}`
        }

        return {
          Date: op.dateOperation || op.date,
          Service: op.service,
          Catégorie: op.categorie,
          Montant: montantDisplay,
          Agent: op.agent?.name || op.agent,
          'Point Service': op.pointService?.name || op.pointService,
          Pays: op.pays
        }
      }) || []
      exportToExcel(exportData, `rapport-${tab === 0 ? 'journalier' : tab === 1 ? 'hebdomadaire' : 'mensuel'}`)
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
      const exportData = data?.operations?.map(op => {
        // Déterminer le montant à afficher selon le type d'opération
        let montantDisplay = 'N/A'
        if (op.montantRecu && op.montantEnvoye) {
          montantDisplay = `Reçu: ${op.montantRecu} ${op.deviseRecu || 'XOF'} | Envoyé: ${op.montantEnvoye} ${op.deviseEnvoye || 'XOF'}`
        } else if (op.montant) {
          montantDisplay = `${op.montant} ${op.devise || 'XOF'}`
        }

        return {
          date: op.dateOperation || op.date,
          service: op.service,
          categorie: op.categorie,
          montant: montantDisplay,
          agent: op.agent?.name || op.agent,
          pointService: op.pointService?.name || op.pointService,
          pays: op.pays
        }
      }) || []
      exportToPDF(exportData, columns, `rapport-${tab === 0 ? 'journalier' : tab === 1 ? 'hebdomadaire' : 'mensuel'}`)
      toast.success('Export PDF réussi !')
    } catch (error) {
      toast.error('Erreur lors de l\'export PDF')
    }
  }

  return (
    <Layout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight={700}>
            Rapports
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <MuiButton
              variant="outlined"
              startIcon={<FileDownload />}
              onClick={handleExportExcel}
              disabled={!data}
            >
              Excel
            </MuiButton>
            <MuiButton
              variant="outlined"
              startIcon={<PictureAsPdf />}
              onClick={handleExportPDF}
              disabled={!data}
            >
              PDF
            </MuiButton>
          </Box>
        </Box>

        <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)} sx={{ mb: 3 }}>
          <Tab label="Journalier" />
          <Tab label="Hebdomadaire" />
          <Tab label="Mensuel" />
        </Tabs>

        {/* Filtres selon l'onglet */}
        <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
          {tab === 0 && (
            <TextField
              label="Date"
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 200 }}
            />
          )}
          {tab === 1 && (
            <>
              <TextField
                label="Date Début"
                type="date"
                value={filters.weekStart}
                onChange={(e) => setFilters({ ...filters, weekStart: e.target.value })}
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 200 }}
              />
              <TextField
                label="Date Fin"
                type="date"
                value={filters.weekEnd}
                onChange={(e) => setFilters({ ...filters, weekEnd: e.target.value })}
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 200 }}
              />
            </>
          )}
          {tab === 2 && (
            <>
              <TextField
                label="Mois"
                select
                value={filters.month}
                onChange={(e) => setFilters({ ...filters, month: e.target.value })}
                sx={{ minWidth: 150 }}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <MenuItem key={month} value={month}>
                    {new Date(2024, month - 1).toLocaleString('fr-FR', { month: 'long' })}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Année"
                type="number"
                value={filters.year}
                onChange={(e) => setFilters({ ...filters, year: parseInt(e.target.value) })}
                sx={{ minWidth: 150 }}
              />
            </>
          )}
        </Box>

        {/* Statistiques */}
        {data && (
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Opérations"
                value={data.totalOperations || 0}
                icon={<Receipt sx={{ color: 'var(--color-primary)', fontSize: 32 }} />}
                color="var(--color-primary)"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Montant Total"
                value={formatCurrency(data.montantTotal || 0)}
                icon={<AttachMoney sx={{ color: 'var(--color-success)', fontSize: 32 }} />}
                color="var(--color-success)"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Par Service"
                value={data.parService?.length || 0}
                color="var(--color-warning)"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Par Type"
                value={data.parType?.length || 0}
                color="var(--color-purple)"
              />
            </Grid>
          </Grid>
        )}

        {/* Graphiques */}
        {data && (
          <Grid container spacing={3}>
            {data.evolutionTemporelle && (
              <Grid item xs={12}>
                <LineChartCard
                  title="Évolution Temporelle"
                  data={data.evolutionTemporelle}
                  dataKey="montant"
                  xKey="date"
                />
              </Grid>
            )}
            {data.parService && (
              <Grid item xs={12} md={6}>
                <PieChartCard
                  title="Répartition par Service"
                  data={data.parService}
                  dataKey="value"
                  nameKey="name"
                />
              </Grid>
            )}
            {data.parType && (
              <Grid item xs={12} md={6}>
                <BarChartCard
                  title="Répartition par Type"
                  data={data.parType}
                  dataKey="value"
                  xKey="name"
                />
              </Grid>
            )}
          </Grid>
        )}

        {loading && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography>Chargement...</Typography>
          </Box>
        )}

        {!loading && !data && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">Aucune donnée disponible</Typography>
          </Box>
        )}
      </Box>
    </Layout>
  )
}

export default Reports
