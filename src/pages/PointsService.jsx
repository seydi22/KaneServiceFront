import { useState, useEffect } from 'react'
import { Box, Typography, Button as MuiButton, IconButton, TextField, MenuItem } from '@mui/material'
import { Add, Edit, Delete } from '@mui/icons-material'
import { toast } from 'react-toastify'
import { pointsServiceService } from '../services/pointsService'
import Layout from '../components/layout/Layout'
import Table from '../components/common/Table'
import Modal from '../components/common/Modal'
import Button from '../components/common/Button'
import { useForm } from 'react-hook-form'

const PointsService = () => {
  const [loading, setLoading] = useState(true)
  const [points, setPoints] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [editingPoint, setEditingPoint] = useState(null)
  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  const fetchPoints = async () => {
    setLoading(true)
    try {
      const response = await pointsServiceService.getAll()
      const list = Array.isArray(response) ? response : (response?.data ?? response)
      setPoints(Array.isArray(list) ? list : [])
    } catch (error) {
      toast.error('Erreur lors du chargement des points de service')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPoints()
  }, [])

  const handleCreate = () => {
    setEditingPoint(null)
    reset()
    setOpenModal(true)
  }

  const handleEdit = (point) => {
    setEditingPoint(point)
    reset(point)
    setOpenModal(true)
  }

  const handleDelete = async (id) => {
    if (!id) {
      toast.error('Identifiant du point de service manquant')
      return
    }
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce point de service ?')) {
      try {
        await pointsServiceService.delete(id)
        toast.success('Point de service supprimé avec succès')
        fetchPoints()
      } catch (error) {
        toast.error(error.response?.data?.message || 'Erreur lors de la suppression')
      }
    }
  }

  const onSubmit = async (data) => {
    try {
      if (editingPoint) {
        const id = editingPoint._id || editingPoint.id
        await pointsServiceService.update(id, data)
        toast.success('Point de service modifié avec succès')
      } else {
        await pointsServiceService.create(data)
        toast.success('Point de service créé avec succès')
      }
      setOpenModal(false)
      reset()
      fetchPoints()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'enregistrement')
    }
  }

  const columns = [
    { key: 'nom', label: 'Nom' },
    { key: 'adresse', label: 'Adresse' },
    { key: 'ville', label: 'Ville' },
    { key: 'pays', label: 'Pays' },
    { key: 'telephone', label: 'Téléphone' },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <Box>
          <IconButton size="small" onClick={() => handleEdit(row)} color="primary">
            <Edit />
          </IconButton>
          <IconButton size="small" onClick={() => handleDelete(row._id || row.id)} color="error">
            <Delete />
          </IconButton>
        </Box>
      )
    }
  ]

  return (
    <Layout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight={700}>
            Points de Service
          </Typography>
          <MuiButton
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreate}
            sx={{ backgroundColor: 'var(--color-primary)' }}
          >
            Nouveau Point de Service
          </MuiButton>
        </Box>

        <Table
          columns={columns}
          data={points}
          loading={loading}
        />

        <Modal
          open={openModal}
          onClose={() => {
            setOpenModal(false)
            reset()
          }}
          title={editingPoint ? 'Modifier Point de Service' : 'Nouveau Point de Service'}
          maxWidth="sm"
          actions={
            <>
              <Button
                variant="outlined"
                onClick={() => {
                  setOpenModal(false)
                  reset()
                }}
              >
                Annuler
              </Button>
              <Button variant="contained" onClick={handleSubmit(onSubmit)}>
                {editingPoint ? 'Modifier' : 'Créer'}
              </Button>
            </>
          }
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="Nom"
              fullWidth
              {...register('nom', { required: 'Nom requis' })}
              error={!!errors.nom}
              helperText={errors.nom?.message}
              sx={{ mb: 2 }}
            />

            <TextField
              label="Adresse"
              fullWidth
              {...register('adresse', { required: 'Adresse requise' })}
              error={!!errors.adresse}
              helperText={errors.adresse?.message}
              sx={{ mb: 2 }}
            />

            <TextField
              label="Ville"
              fullWidth
              {...register('ville', { required: 'Ville requise' })}
              error={!!errors.ville}
              helperText={errors.ville?.message}
              sx={{ mb: 2 }}
            />

            <TextField
              label="Pays"
              select
              fullWidth
              {...register('pays', { required: 'Pays requis' })}
              error={!!errors.pays}
              helperText={errors.pays?.message}
              sx={{ mb: 2 }}
            >
              <MenuItem value="Mauritanie">Mauritanie</MenuItem>
              <MenuItem value="Mali">Mali</MenuItem>
              <MenuItem value="Senegal">Sénégal</MenuItem>
            </TextField>

            <TextField
              label="Téléphone"
              fullWidth
              {...register('telephone')}
              sx={{ mb: 2 }}
            />
          </form>
        </Modal>
      </Box>
    </Layout>
  )
}

export default PointsService
