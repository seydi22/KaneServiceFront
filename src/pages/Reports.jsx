import { useState, useEffect } from 'react'
import { Box, Typography, Tabs, Tab, TextField, MenuItem, Button as MuiButton, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'
import { FileDownload, PictureAsPdf, Tune } from '@mui/icons-material'
import { toast } from 'react-toastify'
import { formatCurrency } from '../utils/format'
import { reportsService } from '../services/reports'
import { exportReportToPDF, exportReportToExcelMultiSheets } from '../utils/export'
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
          mouvementsParPointService: data?.mouvementsParPointService ?? [],
          caisseGlobale: data?.caisseGlobale ?? null,
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
      exportReportToPDF(
        {
          totalOperations: data?.totalOperations ?? data?.stats?.totalOperations ?? data?.statsGlobales?.totalOperations ?? 0,
          montantTotalFcfa: data?.montantTotalFcfa ?? data?.stats?.totalFcfa ?? data?.statsGlobales?.totalFcfa ?? 0,
          montantTotalOuguiya: data?.montantTotalOuguiya ?? data?.stats?.totalOuguiya ?? data?.statsGlobales?.totalOuguiya ?? 0,
          mouvementsParPointService: data?.mouvementsParPointService ?? [],
          caisseGlobale: data?.caisseGlobale ?? null,
          operations: data?.operations ?? [],
          periode: data?.date ?? data?.periode,
        },
        `rapport-${tab === 0 ? 'journalier' : tab === 1 ? 'hebdomadaire' : 'mensuel'}`
      )
      toast.success('Export PDF réussi !')
    } catch (error) {
      toast.error('Erreur lors de l\'export PDF')
    }
  }

  return (
    <Layout>
      <Box>
        <Box sx={{ mb: 2.25, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: '-0.03em' }}>
              Rapports
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mt: 0.5 }}>
              Journalier, hebdomadaire et mensuel — exports premium (Excel / PDF)
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.25, flexWrap: 'wrap' }}>
            <MuiButton
              variant="outlined"
              startIcon={<FileDownload />}
              onClick={handleExportExcel}
              disabled={!data}
              sx={{
                borderRadius: 'var(--radius-lg)',
                textTransform: 'none',
                fontWeight: 700,
                borderColor: 'var(--border-light)',
              }}
            >
              Excel
            </MuiButton>
            <MuiButton
              variant="outlined"
              startIcon={<PictureAsPdf />}
              onClick={handleExportPDF}
              disabled={!data}
              sx={{
                borderRadius: 'var(--radius-lg)',
                textTransform: 'none',
                fontWeight: 700,
                borderColor: 'var(--border-light)',
              }}
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
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
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
        </Paper>

        {/* Statistiques */}
        {data && (
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={2}>
              <StatCard
                title="Total Opérations"
                value={data.totalOperations ?? data.stats?.totalOperations ?? data.statsGlobales?.totalOperations ?? 0}
                icon={<Receipt sx={{ color: 'var(--color-primary-light)', fontSize: 32 }} />}
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
            <TableContainer
              component={Paper}
              variant="outlined"
              sx={{
                borderRadius: 'var(--radius-xl)',
                borderColor: 'var(--border-light)',
                overflow: 'hidden',
                boxShadow: '0 18px 50px rgba(0, 0, 0, 0.22)'
              }}
            >
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: 'rgba(148, 163, 184, 0.06)' }}>
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
                    <TableRow
                      key={row.agentId || row._id}
                      hover
                      sx={{
                        '&:hover': { bgcolor: 'rgba(148, 163, 184, 0.08)' },
                      }}
                    >
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

        {/* Caisse globale (compte partagé) */}
        {data?.caisseGlobale && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 800, letterSpacing: '-0.01em' }}>
              Caisse globale (compte partagé)
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2.25,
                    borderRadius: 'var(--radius-xl)',
                    borderColor: 'var(--border-light)',
                    backgroundImage:
                      'radial-gradient(1200px 600px at 20% -20%, rgba(34, 197, 94, 0.10), transparent 50%), radial-gradient(900px 500px at 80% 0%, rgba(13, 148, 136, 0.06), transparent 45%)',
                    boxShadow: '0 18px 50px rgba(0, 0, 0, 0.22)',
                  }}
                >
                  <Typography variant="subtitle2" sx={{ color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    FCFA (XOF)
                  </Typography>
                  <Table size="small" sx={{ mt: 1 }}>
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ color: 'var(--text-secondary)' }}>Solde initial (alimentation)</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 800 }}>{formatCurrency(data.caisseGlobale.soldeInitialFcfa ?? 0, 'XOF')}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ color: 'var(--text-secondary)' }}>Transactions (sorties)</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 800 }}>{formatCurrency(data.caisseGlobale.totalTransactionsFcfa ?? 0, 'XOF')}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ color: 'var(--text-secondary)' }}>Volume (a circulé)</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 800 }}>{formatCurrency(data.caisseGlobale.volumeFcfa ?? 0, 'XOF')}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 800 }}>Solde final</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 900, color: 'var(--color-success)' }}>
                          {formatCurrency(data.caisseGlobale.soldeFinalFcfa ?? 0, 'XOF')}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2.25,
                    borderRadius: 'var(--radius-xl)',
                    borderColor: 'var(--border-light)',
                    backgroundImage:
                      'radial-gradient(1200px 600px at 20% -20%, rgba(245, 158, 11, 0.10), transparent 50%), radial-gradient(900px 500px at 80% 0%, rgba(37, 99, 235, 0.06), transparent 45%)',
                    boxShadow: '0 18px 50px rgba(0, 0, 0, 0.22)',
                  }}
                >
                  <Typography variant="subtitle2" sx={{ color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Ouguiya (MRU)
                  </Typography>
                  <Table size="small" sx={{ mt: 1 }}>
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ color: 'var(--text-secondary)' }}>Solde initial (alimentation)</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 800 }}>{formatCurrency(data.caisseGlobale.soldeInitialOuguiya ?? 0, 'MRU')}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ color: 'var(--text-secondary)' }}>Transactions (sorties)</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 800 }}>{formatCurrency(data.caisseGlobale.totalTransactionsOuguiya ?? 0, 'MRU')}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ color: 'var(--text-secondary)' }}>Volume (a circulé)</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 800 }}>{formatCurrency(data.caisseGlobale.volumeOuguiya ?? 0, 'MRU')}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 800 }}>Solde final</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 900, color: 'var(--color-warning)' }}>
                          {formatCurrency(data.caisseGlobale.soldeFinalOuguiya ?? 0, 'MRU')}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Mouvements par point de service (info) */}
        {Array.isArray(data?.mouvementsParPointService) && data.mouvementsParPointService.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 800, letterSpacing: '-0.01em' }}>
              Mouvements par point de service (caisse partagée)
            </Typography>
            <TableContainer
              component={Paper}
              variant="outlined"
              sx={{
                borderRadius: 'var(--radius-xl)',
                borderColor: 'var(--border-light)',
                overflow: 'hidden',
                boxShadow: '0 18px 50px rgba(0, 0, 0, 0.22)'
              }}
            >
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: 'rgba(148, 163, 184, 0.06)' }}>
                    <TableCell><strong>Point de service</strong></TableCell>
                    <TableCell><strong>Ville</strong></TableCell>
                    <TableCell><strong>Pays</strong></TableCell>
                    <TableCell align="right"><strong>Volume FCFA</strong></TableCell>
                    <TableCell align="right"><strong>Volume Ouguiya</strong></TableCell>
                    <TableCell align="right"><strong>Transactions FCFA (sorties)</strong></TableCell>
                    <TableCell align="right"><strong>Transactions Ouguiya (sorties)</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.mouvementsParPointService.map((p, idx) => (
                    <TableRow
                      key={p.pointServiceId || p._id || `${p.nom}-${idx}`}
                      hover
                      sx={{
                        '&:hover': { bgcolor: 'rgba(148, 163, 184, 0.08)' },
                      }}
                    >
                      <TableCell>{p.nom ?? '-'}</TableCell>
                      <TableCell>{p.ville ?? '-'}</TableCell>
                      <TableCell>{p.pays ?? '-'}</TableCell>
                      <TableCell align="right">{formatCurrency(p.volumeFcfa ?? 0, 'XOF')}</TableCell>
                      <TableCell align="right">{formatCurrency(p.volumeOuguiya ?? 0, 'MRU')}</TableCell>
                      <TableCell align="right">{formatCurrency(p.totalTransactionsFcfa ?? 0, 'XOF')}</TableCell>
                      <TableCell align="right">{formatCurrency(p.totalTransactionsOuguiya ?? 0, 'MRU')}</TableCell>
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
