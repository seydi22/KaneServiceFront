import { useState, useEffect } from 'react'
import { Box, Typography, Tabs, Tab, TextField, MenuItem, Button as MuiButton, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'
import { FileDownload, PictureAsPdf } from '@mui/icons-material'
import { toast } from 'react-toastify'
import { formatCurrency } from '../utils/format'
import { reportsService } from '../services/reports'
import { exportToPDF, exportReportToExcelMultiSheets } from '../utils/export'
import Layout from '../components/layout/Layout'
import StatCard from '../components/dashboard/StatCard'
import { LineChartCard, BarChartCard, PieChartCard } from '../components/dashboard/Charts'
import { Receipt, AttachMoney, Person } from '@mui/icons-material'

const Reports = () => {
  const [tab, setTab] = useState(0)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [listesFiltres, setListesFiltres] = useState({ pointsService: [], agents: [], categories: [] })
  const [filters, setFilters] = useState({
    date: new Date().toISOString().split('T')[0],
    weekStart: new Date().toISOString().split('T')[0],
    weekEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    pointService: '',
    agent: '',
    categorie: ''
  })

  useEffect(() => {
    reportsService.getFiltres().then(setListesFiltres).catch(() => setListesFiltres({ pointsService: [], agents: [], categories: [] }))
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const filtresOptionnels = {
        ...(filters.pointService && { pointService: filters.pointService }),
        ...(filters.agent && { agent: filters.agent }),
        ...(filters.categorie && { categorie: filters.categorie })
      }
      let response
      if (tab === 0) {
        response = await reportsService.getJournalier(filters.date, filtresOptionnels)
      } else if (tab === 1) {
        response = await reportsService.getHebdomadaire(filters.weekStart, filters.weekEnd, filtresOptionnels)
      } else {
        response = await reportsService.getMensuel(filters.month, filters.year, filtresOptionnels)
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

  const handleExportExcel = async () => {
    try {
      await exportReportToExcelMultiSheets(
        {
          totalOperations: data?.totalOperations ?? data?.stats?.totalOperations ?? data?.statsGlobales?.totalOperations,
          montantTotal: data?.montantTotal ?? data?.stats?.totalMontant ?? data?.statsGlobales?.totalMontant ?? 0,
          montantTotalFcfa: data?.montantTotalFcfa ?? data?.stats?.totalFcfa ?? data?.statsGlobales?.totalFcfa ?? 0,
          montantTotalOuguiya: data?.montantTotalOuguiya ?? data?.stats?.totalOuguiya ?? data?.statsGlobales?.totalOuguiya ?? 0,
          statsParAgent: data?.statsParAgent ?? [],
          statsParPointService: data?.statsParPointService ?? [],
          statsParCategorie: data?.statsParCategorie ?? [],
          operations: data?.operations ?? [],
          periode: data?.date ?? data?.periode
        },
        `rapport-${tab === 0 ? 'journalier' : tab === 1 ? 'hebdomadaire' : 'mensuel'}`
      )
      toast.success('Export Excel (plusieurs feuilles) réussi !')
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
        { key: 'matricule', label: 'Matricule' },
        { key: 'pointService', label: 'Point Service' },
        { key: 'pays', label: 'Pays' }
      ]
      const exportData = data?.operations?.map(op => {
        let montantDisplay = 'N/A'
        if (op.montantRecu != null && op.montantEnvoye != null) {
          montantDisplay = `Reçu: ${op.montantRecu} ${op.deviseRecu || 'XOF'} | Envoyé: ${op.montantEnvoye} ${op.deviseEnvoye || 'XOF'}`
        } else if (op.montant != null) {
          montantDisplay = `${op.montant} ${op.devise || 'XOF'}`
        }
        const agentLabel = op.agent ? [op.agent.prenom, op.agent.nom].filter(Boolean).join(' ') : '-'
        return {
          date: op.dateOperation ? new Date(op.dateOperation).toLocaleString('fr-FR') : '-',
          service: op.service,
          categorie: op.categorie,
          montant: montantDisplay,
          agent: agentLabel,
          matricule: op.agent?.matricule ?? '-',
          pointService: op.pointService?.nom ?? '-',
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
        <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
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
          <TextField
            label="Point de service"
            select
            value={filters.pointService}
            onChange={(e) => setFilters({ ...filters, pointService: e.target.value })}
            sx={{ minWidth: 220 }}
          >
            <MenuItem value="">Tous</MenuItem>
            {listesFiltres.pointsService?.map((ps) => (
              <MenuItem key={ps._id} value={ps._id}>{ps.nom}{ps.ville ? ` - ${ps.ville}` : ''}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Agent"
            select
            value={filters.agent}
            onChange={(e) => setFilters({ ...filters, agent: e.target.value })}
            sx={{ minWidth: 220 }}
          >
            <MenuItem value="">Tous</MenuItem>
            {listesFiltres.agents?.map((a) => (
              <MenuItem key={a._id} value={a._id}>{a.label ?? `${a.prenom} ${a.nom} (${a.matricule})`}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Catégorie"
            select
            value={filters.categorie}
            onChange={(e) => setFilters({ ...filters, categorie: e.target.value })}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">Toutes</MenuItem>
            {listesFiltres.categories?.map((c) => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
          </TextField>
        </Box>

        {/* Statistiques */}
        {data && (
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={2}>
              <StatCard
                title="Total Opérations"
                value={data.totalOperations ?? data.stats?.totalOperations ?? data.statsGlobales?.totalOperations ?? 0}
                icon={<Receipt sx={{ color: 'var(--color-primary)', fontSize: 32 }} />}
                color="var(--color-primary)"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <StatCard
                title="Total FCFA (XOF)"
                value={formatCurrency(data.montantTotalFcfa ?? data.stats?.totalFcfa ?? data.statsGlobales?.totalFcfa ?? 0, 'XOF')}
                icon={<AttachMoney sx={{ color: 'var(--color-success)', fontSize: 32 }} />}
                color="var(--color-success)"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <StatCard
                title="Total Ouguiya (MRU)"
                value={formatCurrency(data.montantTotalOuguiya ?? data.stats?.totalOuguiya ?? data.statsGlobales?.totalOuguiya ?? 0, 'MRU')}
                icon={<AttachMoney sx={{ color: 'var(--color-info)', fontSize: 32 }} />}
                color="var(--color-info)"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <StatCard
                title="Services"
                value={data.parService?.length ?? data.statsParService?.length ?? 0}
                color="var(--color-warning)"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <StatCard
                title="Catégories"
                value={data.parType?.length ?? data.statsParCategorie?.length ?? 0}
                color="var(--color-purple)"
              />
            </Grid>
          </Grid>
        )}

        {/* Détail par agent */}
        {data?.statsParAgent?.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Person sx={{ color: 'var(--color-primary)' }} /> Détail par agent
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: 'action.hover' }}>
                    <TableCell><strong>Agent</strong></TableCell>
                    <TableCell><strong>Matricule</strong></TableCell>
                    <TableCell align="right"><strong>Nb opérations</strong></TableCell>
                    <TableCell align="right"><strong>Total FCFA</strong></TableCell>
                    <TableCell align="right"><strong>Total Ouguiya</strong></TableCell>
                    <TableCell><strong>Première opération</strong></TableCell>
                    <TableCell><strong>Dernière opération</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.statsParAgent.map((row) => (
                    <TableRow key={row.agentId || row._id}>
                      <TableCell>{[row.prenom, row.nom].filter(Boolean).join(' ') || row.matricule || '-'}</TableCell>
                      <TableCell>{row.matricule ?? '-'}</TableCell>
                      <TableCell align="right">{row.totalOperations ?? 0}</TableCell>
                      <TableCell align="right">{formatCurrency(row.totalFcfa ?? 0, 'XOF')}</TableCell>
                      <TableCell align="right">{formatCurrency(row.totalOuguiya ?? 0, 'MRU')}</TableCell>
                      <TableCell>{row.premierOp ? new Date(row.premierOp).toLocaleString('fr-FR') : '-'}</TableCell>
                      <TableCell>{row.dernierOp ? new Date(row.dernierOp).toLocaleString('fr-FR') : '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
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
