import { useState, useEffect, useMemo } from 'react'
import {
  Box,
  Typography,
  Button as MuiButton,
  TextField,
  MenuItem,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Alert
} from '@mui/material'
import { Add, Edit, Delete, LockReset, CheckCircle, Cancel } from '@mui/icons-material'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { usersService } from '../services/users'
import { pointsServiceService } from '../services/pointsService'
import { PAYS, ROLES } from '../constants'
import Layout from '../components/layout/Layout'
import Table from '../components/common/Table'
import Button from '../components/common/Button'
import { useAuth } from '../context/AuthContext'

const Users = () => {
  const { user: currentUser } = useAuth()
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState([])
  const [pointsService, setPointsService] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [openPasswordModal, setOpenPasswordModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    role: '',
    pays: '',
    pointService: '',
    actif: ''
  })

  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm()

  // Points déjà assignés à un autre agent (un point = un agent). En édition, on exclut l'utilisateur en cours.
  const pointIdsAssignesAutresAgents = useMemo(() => {
    return new Set(
      users
        .filter((u) => u.role === ROLES.AGENT)
        .filter((u) => !editingUser || (u._id || u.id) !== (editingUser._id || editingUser.id))
        .map((u) => (u.pointService?._id || u.pointService)?.toString?.())
        .filter(Boolean)
    )
  }, [users, editingUser])

  useEffect(() => {
    fetchUsers()
    fetchPointsService()
  }, [filters])

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await usersService.getAll(filters)
      setUsers(Array.isArray(response) ? response : response.data || [])
      setError(null)
    } catch (err) {
      console.error('Erreur fetchUsers:', err)
      if (err.response?.status === 404) {
        // Route non trouvée - le backend n'a peut-être pas cette route encore
        const errorMsg = `❌ Route API non trouvée (404)

URL appelée : ${err.config?.baseURL || 'http://localhost:5000/api'}${err.config?.url || '/users'}

✅ Le backend répond (les autres routes fonctionnent)
❌ Mais la route GET /api/users n'existe pas

Vérifiez dans votre backend :
1. Le fichier de routes (ex: routes/userRoutes.js ou routes/index.js)
2. Que la route est définie : router.get('/users', auth, isAdmin, userController.getUsers)
3. Que le router est monté : app.use('/api/users', userRoutes)
4. Que le contrôleur userController.getUsers existe`
        setError(errorMsg)
        setUsers([])
        // Ne pas spammer avec des toasts pour les 404
      } else if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
        setError('Impossible de se connecter au serveur. Vérifiez que le backend est démarré sur http://localhost:5000')
        setUsers([])
        toast.error('Impossible de se connecter au serveur')
      } else if (err.response?.status === 401) {
        setError('Non authentifié. Veuillez vous reconnecter.')
        setUsers([])
      } else if (err.response?.status === 403) {
        setError('Accès refusé. Seuls les administrateurs peuvent accéder à cette page.')
        setUsers([])
      } else {
        setError(err.response?.data?.message || 'Erreur lors du chargement des utilisateurs')
        setUsers([])
        toast.error(err.response?.data?.message || 'Erreur lors du chargement des utilisateurs')
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchPointsService = async () => {
    try {
      const response = await pointsServiceService.getAll()
      setPointsService(Array.isArray(response) ? response : response.data || [])
    } catch (error) {
      console.error('Erreur lors du chargement des points de service')
    }
  }

  const handleCreate = () => {
    setEditingUser(null)
    reset()
    setOpenModal(true)
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    reset({
      nom: user.nom,
      prenom: user.prenom,
      matricule: user.matricule,
      role: user.role,
      pays: user.pays,
      pointService: user.pointService?._id || user.pointService,
      actif: user.actif !== false
    })
    setOpenModal(true)
  }

  const handleDelete = async (id) => {
    if (id === currentUser?.id) {
      toast.error('Vous ne pouvez pas supprimer votre propre compte')
      return
    }
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await usersService.delete(id)
        toast.success('Utilisateur supprimé avec succès')
        fetchUsers()
      } catch (error) {
        toast.error(error.response?.data?.message || 'Erreur lors de la suppression')
      }
    }
  }

  const handleToggleStatus = async (id) => {
    if (id === currentUser?.id) {
      toast.error('Vous ne pouvez pas désactiver votre propre compte')
      return
    }
    try {
      await usersService.toggleStatus(id)
      toast.success('Statut modifié avec succès')
      fetchUsers()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la modification')
    }
  }

  const handleResetPassword = () => {
    setOpenPasswordModal(true)
  }

  const onSubmit = async (data) => {
    try {
      if (editingUser) {
        await usersService.update(editingUser._id || editingUser.id, data)
        toast.success('Utilisateur modifié avec succès')
      } else {
        await usersService.create(data)
        toast.success('Utilisateur créé avec succès')
      }
      setOpenModal(false)
      reset()
      fetchUsers()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'enregistrement')
    }
  }

  const onSubmitPassword = async (data) => {
    try {
      await usersService.resetPassword(selectedUserId, data.password)
      toast.success('Mot de passe réinitialisé avec succès')
      setOpenPasswordModal(false)
      setSelectedUserId(null)
      reset()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la réinitialisation')
    }
  }

  const columns = [
    {
      key: 'nom',
      label: 'Nom',
      render: (row) => `${row.prenom || ''} ${row.nom || ''}`.trim() || 'N/A'
    },
    { key: 'matricule', label: 'Matricule' },
    {
      key: 'role',
      label: 'Rôle',
      render: (row) => (
        <Chip
          label={row.role === ROLES.ADMIN ? 'Admin' : 'Agent'}
          color={row.role === ROLES.ADMIN ? 'primary' : 'default'}
          size="small"
        />
      )
    },
    { key: 'pays', label: 'Pays' },
    {
      key: 'pointService',
      label: 'Point de Service',
      render: (row) => row.pointService?.nom || row.pointService?.name || 'N/A'
    },
    {
      key: 'actif',
      label: 'Statut',
      render: (row) => (
        <Chip
          icon={row.actif !== false ? <CheckCircle /> : <Cancel />}
          label={row.actif !== false ? 'Actif' : 'Inactif'}
          color={row.actif !== false ? 'success' : 'default'}
          size="small"
        />
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => {
        const userId = row._id || row.id
        const isCurrentUser = userId === currentUser?.id
        return (
          <Box>
            <IconButton size="small" onClick={() => handleEdit(row)} color="primary">
              <Edit />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => handleToggleStatus(userId)}
              color={row.actif !== false ? 'warning' : 'success'}
              disabled={isCurrentUser}
            >
              {row.actif !== false ? <Cancel /> : <CheckCircle />}
            </IconButton>
            <IconButton
              size="small"
              onClick={() => {
                setSelectedUserId(userId)
                handleResetPassword()
              }}
              color="info"
            >
              <LockReset />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => handleDelete(userId)}
              color="error"
              disabled={isCurrentUser}
            >
              <Delete />
            </IconButton>
          </Box>
        )
      }
    }
  ]

  return (
    <Layout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight={700}>
            Gestion des Utilisateurs
          </Typography>
          <MuiButton
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreate}
            sx={{ backgroundColor: 'var(--color-primary)' }}
          >
            Nouvel Utilisateur
          </MuiButton>
        </Box>

        {/* Filtres */}
        <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Rôle"
            select
            value={filters.role}
            onChange={(e) => setFilters({ ...filters, role: e.target.value })}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">Tous</MenuItem>
            <MenuItem value={ROLES.ADMIN}>Admin</MenuItem>
            <MenuItem value={ROLES.AGENT}>Agent</MenuItem>
          </TextField>
          <TextField
            label="Pays"
            select
            value={filters.pays}
            onChange={(e) => setFilters({ ...filters, pays: e.target.value })}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">Tous</MenuItem>
            {PAYS.map((pays) => (
              <MenuItem key={pays} value={pays}>
                {pays}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Point de Service"
            select
            value={filters.pointService}
            onChange={(e) => setFilters({ ...filters, pointService: e.target.value })}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">Tous</MenuItem>
            {pointsService.map((point) => (
              <MenuItem key={point._id || point.id} value={point._id || point.id}>
                {point.nom || point.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Statut"
            select
            value={filters.actif}
            onChange={(e) => setFilters({ ...filters, actif: e.target.value })}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">Tous</MenuItem>
            <MenuItem value="true">Actif</MenuItem>
            <MenuItem value="false">Inactif</MenuItem>
          </TextField>
        </Box>

        {error && (
          <Box sx={{ p: 3, mb: 2, backgroundColor: 'var(--color-error-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-error-light)' }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: 'var(--color-error)' }}>
              ⚠️ Erreur de connexion
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line', mb: 2, color: 'var(--color-error)' }}>
              {error}
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => fetchUsers()}
              sx={{ borderColor: 'var(--color-error)', color: 'var(--color-error)' }}
            >
              Réessayer
            </Button>
          </Box>
        )}

        <Table
          columns={columns}
          data={users}
          loading={loading}
        />

        {/* Modal Création/Modification */}
        <Dialog
          open={openModal}
          onClose={() => {
            setOpenModal(false)
            reset()
          }}
          maxWidth="sm"
          fullWidth
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogTitle>
              {editingUser ? 'Modifier Utilisateur' : 'Nouvel Utilisateur'}
            </DialogTitle>
            <DialogContent>
              <TextField
                label="Nom"
                fullWidth
                {...register('nom', { required: 'Nom requis', minLength: { value: 2, message: 'Minimum 2 caractères' } })}
                error={!!errors.nom}
                helperText={errors.nom?.message}
                sx={{ mb: 2, mt: 1 }}
              />

              <TextField
                label="Prénom"
                fullWidth
                {...register('prenom', { required: 'Prénom requis', minLength: { value: 2, message: 'Minimum 2 caractères' } })}
                error={!!errors.prenom}
                helperText={errors.prenom?.message}
                sx={{ mb: 2 }}
              />

              <TextField
                label="Matricule"
                type="text"
                fullWidth
                {...register('matricule', {
                  required: 'Matricule requis',
                  minLength: { value: 2, message: 'Minimum 2 caractères' }
                })}
                error={!!errors.matricule}
                helperText={errors.matricule?.message}
                sx={{ mb: 2 }}
              />

              {!editingUser ? (
                <TextField
                  label="Mot de passe"
                  type="password"
                  fullWidth
                  {...register('password', {
                    required: 'Mot de passe requis',
                    minLength: {
                      value: 6,
                      message: 'Minimum 6 caractères'
                    }
                  })}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  sx={{ mb: 2 }}
                />
              ) : (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Pour modifier le mot de passe, utilisez le bouton "Réinitialiser le mot de passe" dans les actions.
                </Alert>
              )}

              <TextField
                label="Rôle"
                select
                fullWidth
                {...register('role', { required: 'Rôle requis' })}
                error={!!errors.role}
                helperText={errors.role?.message}
                sx={{ mb: 2 }}
              >
                <MenuItem value={ROLES.ADMIN}>Admin</MenuItem>
                <MenuItem value={ROLES.AGENT}>Agent</MenuItem>
              </TextField>

              <TextField
                label="Pays"
                select
                fullWidth
                {...register('pays', { required: 'Pays requis' })}
                error={!!errors.pays}
                helperText={errors.pays?.message}
                sx={{ mb: 2 }}
              >
                {PAYS.map((pays) => (
                  <MenuItem key={pays} value={pays}>
                    {pays}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Point de Service"
                select
                fullWidth
                {...register('pointService', {
                  required: 'Le point de service est obligatoire (chaque agent est lié à un point de service)'
                })}
                error={!!errors.pointService}
                helperText={errors.pointService?.message || (watch('role') === ROLES.AGENT ? 'L\'agent ne verra que ses propres opérations, enregistrées pour ce point.' : null)}
                sx={{ mb: 2 }}
              >
                <MenuItem value="">Sélectionner un point</MenuItem>
                {pointsService.map((point) => {
                  const pointId = (point._id || point.id)?.toString?.()
                  const dejaAssigné = watch('role') === ROLES.AGENT && pointIdsAssignesAutresAgents.has(pointId)
                  return (
                    <MenuItem
                      key={point._id || point.id}
                      value={point._id || point.id}
                      disabled={dejaAssigné}
                    >
                      {point.nom || point.name} {point.ville ? `(${point.ville})` : ''}
                      {dejaAssigné ? ' — déjà assigné' : ''}
                    </MenuItem>
                  )
                })}
              </TextField>

              <FormControlLabel
                control={
                  <Switch
                    checked={watch('actif') !== false}
                    onChange={(e) => setValue('actif', e.target.checked)}
                  />
                }
                label="Actif"
              />
            </DialogContent>
            <DialogActions>
              <Button
                variant="outlined"
                onClick={() => {
                  setOpenModal(false)
                  reset()
                }}
              >
                Annuler
              </Button>
              <Button type="submit" variant="contained">
                {editingUser ? 'Modifier' : 'Créer'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* Modal Réinitialisation Mot de Passe */}
        <Dialog
          open={openPasswordModal}
          onClose={() => {
            setOpenPasswordModal(false)
            setSelectedUserId(null)
            reset()
          }}
          maxWidth="sm"
          fullWidth
        >
          <form onSubmit={handleSubmit(onSubmitPassword)}>
            <DialogTitle>Réinitialiser le Mot de Passe</DialogTitle>
            <DialogContent>
              <Alert severity="info" sx={{ mb: 2 }}>
                Le mot de passe sera réinitialisé pour cet utilisateur.
              </Alert>
              <TextField
                label="Nouveau Mot de Passe"
                type="password"
                fullWidth
                {...register('password', {
                  required: 'Mot de passe requis',
                  minLength: {
                    value: 6,
                    message: 'Minimum 6 caractères'
                  }
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
                sx={{ mb: 2, mt: 1 }}
              />
            </DialogContent>
            <DialogActions>
              <Button
                variant="outlined"
                onClick={() => {
                  setOpenPasswordModal(false)
                  setSelectedUserId(null)
                  reset()
                }}
              >
                Annuler
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Réinitialiser
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </Layout>
  )
}

export default Users
