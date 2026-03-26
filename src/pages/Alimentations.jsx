import { useEffect, useMemo, useState } from 'react'
import { Box, Typography, Grid, TextField, MenuItem, Button as MuiButton, ToggleButtonGroup, ToggleButton } from '@mui/material'
import { Add, Refresh } from '@mui/icons-material'
import { toast } from 'react-toastify'
import Layout from '../components/layout/Layout'
import Table from '../components/common/Table'
import Modal from '../components/common/Modal'
import Button from '../components/common/Button'
import { useForm } from 'react-hook-form'
import { pointsServiceService } from '../services/pointsService'
import { alimentationsService } from '../services/alimentations'
import { formatDateTime, formatCurrency } from '../utils/format'

const Alimentations = () => {
  const [loading, setLoading] = useState(true)
  const [openModal, setOpenModal] = useState(false)
  const [points, setPoints] = useState([])
  const [rows, setRows] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalRows, setTotalRows] = useState(0)
  const [filters, setFilters] = useState({ pointService: '', devise: '', dateDebut: '', dateFin: '' })
  const [devise, setDevise] = useState('XOF')

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    defaultValues: {
      pointService: '',
      montant: '',
      commentaire: '',
      dateAlimentation: new Date().toISOString().split('T')[0],
    }
  })

  const fetchPoints = async () => {
    try {
      const response = await pointsServiceService.getAll()
      const list = Array.isArray(response) ? response : (response?.data ?? response)
      setPoints(Array.isArray(list) ? list : [])
    } catch {
      setPoints([])
    }
  }

  const fetchAlimentations = async () => {
    setLoading(true)
    try {
      const params = {
        ...filters,
        page: page + 1,
        limit: rowsPerPage
      }
      const response = await alimentationsService.getAll(params)
      const data = Array.isArray(response?.data) ? response.data : []
      setRows(data)
      setTotalRows(response?.total ?? data.length)
    } catch (e) {
      toast.error('Erreur lors du chargement des alimentations')
      setRows([])
      setTotalRows(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPoints()
    fetchAlimentations()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    fetchAlimentations()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, filters.pointService, filters.devise, filters.dateDebut, filters.dateFin])

  const onSubmit = async (data) => {
    try {
      const payload = {
        pointService: data.pointService,
        montant: parseFloat(data.montant),
        devise,
        dateAlimentation: data.dateAlimentation,
        commentaire: data.commentaire || ''
      }
      await alimentationsService.create(payload)
      toast.success('Alimentation enregistrée')
      setOpenModal(false)
      reset()
      setDevise('XOF')
      setValue('dateAlimentation', new Date().toISOString().split('T')[0])
      fetchAlimentations()
    } catch (e) {
      toast.error(e.response?.data?.message || 'Erreur lors de l’enregistrement')
    }
  }

  const totals = useMemo(() => {
    let xof = 0
    let mro = 0
    for (const r of rows) {
      if (r.devise === 'XOF') xof += Number(r.montant) || 0
      if (r.devise === 'MRO') mro += Number(r.montant) || 0
    }
    return { xof, mro }
  }, [rows])

  const columns = [
    { key: 'dateAlimentation', label: 'Date', render: (r) => formatDateTime(r.dateAlimentation || r.createdAt) },
    { key: 'pointService', label: 'Point de service', render: (r) => r.pointService?.nom ?? 'N/A' },
    { key: 'ville', label: 'Ville', render: (r) => r.pointService?.ville ?? '-' },
    { key: 'devise', label: 'Devise' },
    { key: 'montant', label: 'Montant', render: (r) => formatCurrency(r.montant ?? 0, r.devise === 'MRO' ? 'MRU' : 'XOF') },
    { key: 'admin', label: 'Saisi par', render: (r) => r.admin ? `${r.admin.prenom} ${r.admin.nom}` : '-' },
    { key: 'commentaire', label: 'Commentaire', render: (r) => r.commentaire || '' },
  ]

  return (
    <Layout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight={700}>
            Alimentations
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <MuiButton variant="outlined" startIcon={<Refresh />} onClick={fetchAlimentations}>
              Actualiser
            </MuiButton>
            <MuiButton
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenModal(true)}
              sx={{ backgroundColor: 'var(--color-primary)' }}
            >
              Nouvelle alimentation
            </MuiButton>
          </Box>
        </Box>

        {/* Filtres */}
        <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Point de service"
            select
            value={filters.pointService}
            onChange={(e) => setFilters({ ...filters, pointService: e.target.value })}
            sx={{ minWidth: 240 }}
          >
            <MenuItem value="">Tous</MenuItem>
            {points.map((p) => (
              <MenuItem key={p._id} value={p._id}>{p.nom}{p.ville ? ` - ${p.ville}` : ''}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Devise"
            select
            value={filters.devise}
            onChange={(e) => setFilters({ ...filters, devise: e.target.value })}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="">Toutes</MenuItem>
            <MenuItem value="XOF">FCFA (XOF)</MenuItem>
            <MenuItem value="MRO">Ouguiya (MRO)</MenuItem>
          </TextField>
          <TextField
            label="Date début"
            type="date"
            value={filters.dateDebut}
            onChange={(e) => setFilters({ ...filters, dateDebut: e.target.value })}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 170 }}
          />
          <TextField
            label="Date fin"
            type="date"
            value={filters.dateFin}
            onChange={(e) => setFilters({ ...filters, dateFin: e.target.value })}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 170 }}
          />
        </Box>

        {/* Totaux rapides (sur la page courante) */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={6}>
            <Typography sx={{ color: 'var(--text-secondary)' }}>
              Total alimenté (page) FCFA : <strong>{formatCurrency(totals.xof, 'XOF')}</strong>
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography sx={{ color: 'var(--text-secondary)' }}>
              Total alimenté (page) Ouguiya : <strong>{formatCurrency(totals.mro, 'MRU')}</strong>
            </Typography>
          </Grid>
        </Grid>

        <Table
          columns={columns}
          data={rows}
          loading={loading}
          page={page}
          rowsPerPage={rowsPerPage}
          totalRows={totalRows}
          onPageChange={(e, newPage) => newPage !== undefined && setPage(newPage)}
          onRowsPerPageChange={(e) => {
            if (e?.target?.value) {
              setRowsPerPage(parseInt(e.target.value, 10))
              setPage(0)
            }
          }}
        />

        <Modal
          open={openModal}
          onClose={() => {
            setOpenModal(false)
            reset()
            setDevise('XOF')
            setValue('dateAlimentation', new Date().toISOString().split('T')[0])
          }}
          title="Nouvelle alimentation"
          maxWidth="sm"
          actions={
            <>
              <Button variant="outlined" onClick={() => setOpenModal(false)}>Annuler</Button>
              <Button variant="contained" onClick={handleSubmit(onSubmit)}>Enregistrer</Button>
            </>
          }
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="Point de service"
              select
              fullWidth
              sx={{ mb: 2 }}
              {...register('pointService', { required: 'Point de service requis' })}
              error={!!errors.pointService}
              helperText={errors.pointService?.message}
            >
              {points.map((p) => (
                <MenuItem key={p._id} value={p._id}>{p.nom}{p.ville ? ` - ${p.ville}` : ''}</MenuItem>
              ))}
            </TextField>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ mb: 1, color: 'var(--text-secondary)' }}>
                Devise
              </Typography>
              <ToggleButtonGroup
                value={devise}
                exclusive
                onChange={(e, v) => v && setDevise(v)}
                size="small"
              >
                <ToggleButton value="XOF">FCFA (XOF)</ToggleButton>
                <ToggleButton value="MRO">Ouguiya (MRO)</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <TextField
              label="Montant"
              type="number"
              fullWidth
              sx={{ mb: 2 }}
              {...register('montant', { required: 'Montant requis', min: { value: 0, message: 'Montant doit être positif' } })}
              error={!!errors.montant}
              helperText={errors.montant?.message}
            />

            <TextField
              label="Date"
              type="date"
              fullWidth
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }}
              {...register('dateAlimentation')}
            />

            <TextField
              label="Commentaire"
              multiline
              rows={3}
              fullWidth
              {...register('commentaire')}
            />
          </form>
        </Modal>
      </Box>
    </Layout>
  )
}

export default Alimentations

