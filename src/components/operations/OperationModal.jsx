import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { TextField, MenuItem, Box } from '@mui/material'
import { toast } from 'react-toastify'
import { operationsService } from '../../services/operations'
import { SERVICES, CATEGORIES, CATEGORIES_LABELS, SERVICE_LABELS, DEVISES, CATEGORIES_WITH_TRANSFER } from '../../constants'
import Modal from '../common/Modal'
import Button from '../common/Button'
import ServiceLogo from '../common/ServiceLogo'

const OperationModal = ({ open, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [selectedService, setSelectedService] = useState('')
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm({
    defaultValues: {
      service: '',
      categorie: '',
      montant: '',
      montantRecu: '',
      montantEnvoye: '',
      devise: '',
      deviseRecu: '',
      deviseEnvoye: '',
      commentaire: ''
    }
  })
  
  const service = watch('service')
  const categorie = watch('categorie')
  
  // Déterminer si la catégorie nécessite montantRecu/montantEnvoye ou montant
  const requiresTransferFields = categorie && CATEGORIES_WITH_TRANSFER.includes(categorie)
  
  useEffect(() => {
    if (service) {
      setSelectedService(service)
      // Réinitialiser la catégorie quand le service change
      setValue('categorie', '')
      setValue('montant', '')
      setValue('montantRecu', '')
      setValue('montantEnvoye', '')
      setValue('devise', '')
      setValue('deviseRecu', '')
      setValue('deviseEnvoye', '')
    } else {
      setSelectedService('')
    }
  }, [service, setValue])

  useEffect(() => {
    // Réinitialiser les champs de montant quand la catégorie change
    if (categorie) {
      if (requiresTransferFields) {
        setValue('montant', '')
        setValue('devise', '')
        // Définir les devises par défaut selon le type de transfert
        if (categorie === 'Transfert_FCFA_to_Ouguiya' || categorie === 'FCFA_to_Ouguiya') {
          setValue('deviseRecu', 'XOF')
          setValue('deviseEnvoye', 'MRO')
        } else if (categorie === 'Transfert_Ouguiya_to_FCFA' || categorie === 'Ouguiya_to_FCFA') {
          setValue('deviseRecu', 'MRO')
          setValue('deviseEnvoye', 'XOF')
        }
      } else {
        setValue('montantRecu', '')
        setValue('montantEnvoye', '')
        setValue('deviseRecu', '')
        setValue('deviseEnvoye', '')
        // Pour les autres catégories, définir XOF par défaut
        setValue('devise', 'XOF')
      }
    }
  }, [categorie, requiresTransferFields, setValue])

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      // Préparer les données selon le type de catégorie
      const operationData = {
        service: data.service,
        categorie: data.categorie,
        commentaire: data.commentaire || ''
      }

      // Ajouter les champs appropriés selon la catégorie
      if (requiresTransferFields) {
        operationData.montantRecu = parseFloat(data.montantRecu)
        operationData.deviseRecu = data.deviseRecu
        operationData.montantEnvoye = parseFloat(data.montantEnvoye)
        operationData.deviseEnvoye = data.deviseEnvoye
      } else {
        operationData.montant = parseFloat(data.montant)
        operationData.devise = data.devise || 'XOF'
      }

      await operationsService.create(operationData)
      reset()
      // Émettre un événement personnalisé pour notifier les dashboards
      window.dispatchEvent(new CustomEvent('operationCreated'))
      onSuccess()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la création')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    reset()
    setSelectedService('')
    onClose()
  }
  


  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Nouvelle Opération"
      maxWidth="sm"
      actions={
        <>
          <Button onClick={handleClose} variant="outlined">
            Annuler
          </Button>
          <Button onClick={handleSubmit(onSubmit)} variant="contained" disabled={loading}>
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="Service"
          select
          fullWidth
          {...register('service', { required: 'Service requis' })}
          value={service || ''}
          error={!!errors.service}
          helperText={errors.service?.message}
          sx={{ mb: 2 }}
        >
          {Object.values(SERVICES).map((serviceKey) => (
            <MenuItem key={serviceKey} value={serviceKey}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                <ServiceLogo service={serviceKey} size={20} />
                <span>{SERVICE_LABELS[serviceKey]}</span>
              </Box>
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Catégorie"
          select
          fullWidth
          disabled={!selectedService}
          {...register('categorie', { required: 'Catégorie requise' })}
          value={watch('categorie') || ''}
          error={!!errors.categorie}
          helperText={errors.categorie?.message || (!selectedService ? 'Sélectionnez d\'abord un service' : '')}
          sx={{ mb: 2 }}
        >
          {selectedService && CATEGORIES[selectedService]?.map((categorie) => (
            <MenuItem key={categorie} value={categorie}>
              {CATEGORIES_LABELS[categorie] || categorie}
            </MenuItem>
          ))}
        </TextField>

        {/* Champs conditionnels selon la catégorie */}
        {requiresTransferFields ? (
          <>
            <TextField
              label="Montant Reçu"
              type="number"
              fullWidth
              {...register('montantRecu', {
                required: 'Montant reçu requis',
                min: { value: 1, message: 'Montant doit être supérieur à 0' }
              })}
              error={!!errors.montantRecu}
              helperText={errors.montantRecu?.message}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Devise Reçue"
              select
              fullWidth
              {...register('deviseRecu', { required: 'Devise reçue requise' })}
              value={watch('deviseRecu') || ''}
              error={!!errors.deviseRecu}
              helperText={errors.deviseRecu?.message}
              sx={{ mb: 2 }}
            >
              {DEVISES.map((devise) => (
                <MenuItem key={devise} value={devise}>
                  {devise}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Montant Envoyé"
              type="number"
              fullWidth
              {...register('montantEnvoye', {
                required: 'Montant envoyé requis',
                min: { value: 1, message: 'Montant doit être supérieur à 0' }
              })}
              error={!!errors.montantEnvoye}
              helperText={errors.montantEnvoye?.message}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Devise Envoyée"
              select
              fullWidth
              {...register('deviseEnvoye', { required: 'Devise envoyée requise' })}
              value={watch('deviseEnvoye') || ''}
              error={!!errors.deviseEnvoye}
              helperText={errors.deviseEnvoye?.message}
              sx={{ mb: 2 }}
            >
              {DEVISES.map((devise) => (
                <MenuItem key={devise} value={devise}>
                  {devise}
                </MenuItem>
              ))}
            </TextField>
          </>
        ) : (
          <>
            <TextField
              label="Montant"
              type="number"
              fullWidth
              disabled={!categorie}
              {...register('montant', {
                required: categorie ? 'Montant requis' : false,
                min: { value: 1, message: 'Montant doit être supérieur à 0' }
              })}
              error={!!errors.montant}
              helperText={errors.montant?.message || (!categorie ? 'Sélectionnez d\'abord une catégorie' : '')}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Devise"
              select
              fullWidth
              disabled={!categorie}
              {...register('devise', { 
                required: categorie ? 'Devise requise' : false 
              })}
              value={watch('devise') || ''}
              error={!!errors.devise}
              helperText={errors.devise?.message || (!categorie ? 'Sélectionnez d\'abord une catégorie' : 'Défaut: XOF')}
              sx={{ mb: 2 }}
            >
              {DEVISES.map((devise) => (
                <MenuItem key={devise} value={devise}>
                  {devise}
                </MenuItem>
              ))}
            </TextField>
          </>
        )}

        <TextField
          label="Commentaire"
          multiline
          rows={3}
          fullWidth
          {...register('commentaire')}
          sx={{ mb: 2 }}
        />
      </form>
    </Modal>
  )
}

export default OperationModal
