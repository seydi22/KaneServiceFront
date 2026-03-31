import { useState, useEffect, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { TextField, MenuItem, Box, Paper } from '@mui/material'
import { toast } from 'react-toastify'
import { operationsService } from '../../services/operations'
import { SERVICES, CATEGORIES, CATEGORIES_LABELS, SERVICE_LABELS, DEVISES, DEVISE_CANAL_PLUS, CATEGORIES_WITH_TRANSFER, CATEGORIES_CHANGE_FOREX } from '../../constants'
import Modal from '../common/Modal'
import Button from '../common/Button'
import ServiceLogo from '../common/ServiceLogo'

const OperationModal = ({ open, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [selectedService, setSelectedService] = useState('')
  const prevServiceRef = useRef(undefined)
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue, control } = useForm({
    defaultValues: {
      service: '',
      categorie: '',
      montant: '',
      montantRecu: '',
      montantEnvoye: '',
      montantFcfa: '',
      montantOuguiya: '',
      devise: '',
      deviseRecu: '',
      deviseEnvoye: '',
      montantDeviseEtrangere: '',
      deviseChange: 'EUR',
      montantMru: '',
      commentaire: ''
    }
  })
  
  const service = watch('service')
  const categorie = watch('categorie')
  
  // Déterminer si la catégorie nécessite montantRecu/montantEnvoye ou montant
  const requiresTransferFields = categorie && CATEGORIES_WITH_TRANSFER.includes(categorie)
  const requiresChangeForexFields =
    service === SERVICES.CHANGE && categorie && CATEGORIES_CHANGE_FOREX.includes(categorie)
  const requiresDualCurrencyFields =
    (service === SERVICES.ORANGE_MONEY || service === SERVICES.WAVE) &&
    (categorie === 'Transfert' || categorie === 'Retrait')
  
  useEffect(() => {
    if (!service) {
      prevServiceRef.current = undefined
      setSelectedService('')
      return
    }
    // Ne réinitialiser les champs dépendants que lorsque le service change réellement
    // (évite les conflits register/value MUI et les effets de bord au redraw)
    if (service !== prevServiceRef.current) {
      prevServiceRef.current = service
      setSelectedService(service)
      setValue('categorie', '')
      setValue('montant', '')
      setValue('montantRecu', '')
      setValue('montantEnvoye', '')
      setValue('montantFcfa', '')
      setValue('montantOuguiya', '')
      setValue('devise', '')
      setValue('deviseRecu', '')
      setValue('deviseEnvoye', '')
      setValue('montantDeviseEtrangere', '')
      setValue('deviseChange', 'EUR')
      setValue('montantMru', '')
    }
  }, [service, setValue])

  useEffect(() => {
    // Réinitialiser les champs de montant quand la catégorie change
    if (categorie) {
      if (requiresDualCurrencyFields) {
        setValue('montant', '')
        setValue('montantRecu', '')
        setValue('montantEnvoye', '')
        setValue('devise', '')
        setValue('deviseRecu', '')
        setValue('deviseEnvoye', '')
        setValue('montantDeviseEtrangere', '')
        setValue('deviseChange', 'EUR')
        setValue('montantMru', '')
      } else if (requiresChangeForexFields) {
        setValue('montant', '')
        setValue('montantRecu', '')
        setValue('montantEnvoye', '')
        setValue('devise', '')
        setValue('deviseRecu', '')
        setValue('deviseEnvoye', '')
        setValue('montantFcfa', '')
        setValue('montantOuguiya', '')
        setValue('montantDeviseEtrangere', '')
        setValue('deviseChange', 'EUR')
        setValue('montantMru', '')
      } else if (requiresTransferFields) {
        setValue('montantFcfa', '')
        setValue('montantOuguiya', '')
        setValue('montant', '')
        setValue('devise', '')
        setValue('montantDeviseEtrangere', '')
        setValue('deviseChange', 'EUR')
        setValue('montantMru', '')
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
        setValue('montantFcfa', '')
        setValue('montantOuguiya', '')
        setValue('montantDeviseEtrangere', '')
        setValue('deviseChange', 'EUR')
        setValue('montantMru', '')
        setValue(
          'devise',
          service === SERVICES.CANAL_PLUS ? DEVISE_CANAL_PLUS : 'XOF'
        )
      }
    }
  }, [categorie, requiresTransferFields, requiresChangeForexFields, requiresDualCurrencyFields, service, setValue])

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
      if (requiresDualCurrencyFields) {
        operationData.montantFcfa = parseFloat(data.montantFcfa)
        operationData.montantOuguiya = parseFloat(data.montantOuguiya)
      } else if (requiresChangeForexFields) {
        operationData.montantDeviseEtrangere = parseFloat(data.montantDeviseEtrangere)
        operationData.deviseChange = data.deviseChange
        operationData.montantMru = parseFloat(data.montantMru)
      } else if (requiresTransferFields) {
        operationData.montantRecu = parseFloat(data.montantRecu)
        operationData.deviseRecu = data.deviseRecu
        operationData.montantEnvoye = parseFloat(data.montantEnvoye)
        operationData.deviseEnvoye = data.deviseEnvoye
      } else {
        operationData.montant = parseFloat(data.montant)
        operationData.devise =
          data.service === SERVICES.CANAL_PLUS
            ? DEVISE_CANAL_PLUS
            : data.devise || 'XOF'
      }

      await operationsService.create(operationData)
      reset()
      prevServiceRef.current = undefined
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
    prevServiceRef.current = undefined
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
      <Paper
        variant="outlined"
        sx={{
          p: { xs: 1.5, sm: 2 },
          borderRadius: 'var(--radius-xl)',
          borderColor: 'var(--border-light)',
          backgroundColor: 'rgba(148, 163, 184, 0.03)',
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="service"
          control={control}
          rules={{ required: 'Service requis' }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Service"
              select
              fullWidth
              value={field.value ?? ''}
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
          )}
        />

        <Controller
          name="categorie"
          control={control}
          rules={{ required: 'Catégorie requise' }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Catégorie"
              select
              fullWidth
              disabled={!selectedService}
              value={field.value ?? ''}
              error={!!errors.categorie}
              helperText={
                errors.categorie?.message ||
                (!selectedService ? 'Sélectionnez d\'abord un service' : '')
              }
              sx={{ mb: 2 }}
            >
              {selectedService &&
                CATEGORIES[selectedService]?.map((catKey) => (
                  <MenuItem key={catKey} value={catKey}>
                    {CATEGORIES_LABELS[catKey] || catKey}
                  </MenuItem>
                ))}
            </TextField>
          )}
        />

        {/* Champs conditionnels selon la catégorie */}
        {requiresDualCurrencyFields ? (
          <>
            <TextField
              label="Montant FCFA (XOF)"
              type="number"
              fullWidth
              {...register('montantFcfa', {
                required: 'Montant FCFA requis',
                min: { value: 0, message: 'Montant doit être positif' }
              })}
              error={!!errors.montantFcfa}
              helperText={errors.montantFcfa?.message}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Montant Ouguiya (MRU)"
              type="number"
              fullWidth
              {...register('montantOuguiya', {
                required: 'Montant Ouguiya requis',
                min: { value: 0, message: 'Montant doit être positif' }
              })}
              error={!!errors.montantOuguiya}
              helperText={errors.montantOuguiya?.message}
              sx={{ mb: 2 }}
            />
          </>
        ) : requiresChangeForexFields ? (
          <>
            <TextField
              label="Montant en devise étrangère"
              type="number"
              fullWidth
              inputProps={{ step: 'any', min: 0 }}
              {...register('montantDeviseEtrangere', {
                required: 'Montant requis',
                min: { value: 0.0001, message: 'Le montant doit être positif' }
              })}
              error={!!errors.montantDeviseEtrangere}
              helperText={errors.montantDeviseEtrangere?.message}
              sx={{ mb: 2 }}
            />
            <Controller
              name="deviseChange"
              control={control}
              rules={{ required: 'Devise requise' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Devise"
                  select
                  fullWidth
                  value={field.value ?? 'EUR'}
                  error={!!errors.deviseChange}
                  helperText={errors.deviseChange?.message || 'Euro ou dollar — drapeaux indicatifs'}
                  sx={{ mb: 2 }}
                >
                  <MenuItem value="EUR">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        component="img"
                        src="https://flagcdn.com/w40/eu.png"
                        alt=""
                        sx={{ width: 28, height: 21, objectFit: 'cover', borderRadius: '4px', boxShadow: '0 0 0 1px rgba(0,0,0,0.08)' }}
                      />
                      <span>Euro (€)</span>
                    </Box>
                  </MenuItem>
                  <MenuItem value="USD">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        component="img"
                        src="https://flagcdn.com/w40/us.png"
                        alt=""
                        sx={{ width: 28, height: 21, objectFit: 'cover', borderRadius: '4px', boxShadow: '0 0 0 1px rgba(0,0,0,0.08)' }}
                      />
                      <span>Dollar ($)</span>
                    </Box>
                  </MenuItem>
                </TextField>
              )}
            />
            <TextField
              label="Équivalent en ouguiya (MRU)"
              type="number"
              fullWidth
              inputProps={{ step: 'any', min: 0 }}
              {...register('montantMru', {
                required: 'Montant MRU requis',
                min: { value: 0.0001, message: 'Le montant doit être positif' }
              })}
              error={!!errors.montantMru}
              helperText={
                errors.montantMru?.message ||
                'Saisie manuelle uniquement — aucun calcul automatique'
              }
              sx={{ mb: 2 }}
            />
            <TextField
              label="Devise de sortie (équivalent)"
              fullWidth
              disabled
              value="Ouguiya (MRU)"
              sx={{ mb: 2 }}
              helperText="Toujours en MRU pour cette opération"
            />
          </>
        ) : requiresTransferFields ? (
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
            {service === SERVICES.CANAL_PLUS ? (
              <>
                <input
                  type="hidden"
                  {...register('devise', {
                    required: categorie ? 'Devise requise' : false,
                  })}
                />
                <TextField
                  label="Devise"
                  fullWidth
                  disabled
                  value="Ouguiya (MRU)"
                  sx={{ mb: 2 }}
                  helperText="Canal+ : montants en ouguiya (MRU) uniquement"
                />
              </>
            ) : (
              <TextField
                label="Devise"
                select
                fullWidth
                disabled={!categorie}
                {...register('devise', {
                  required: categorie ? 'Devise requise' : false,
                })}
                value={watch('devise') || ''}
                error={!!errors.devise}
                helperText={
                  errors.devise?.message ||
                  (!categorie
                    ? 'Sélectionnez d\'abord une catégorie'
                    : 'Défaut: XOF')
                }
                sx={{ mb: 2 }}
              >
                {DEVISES.map((deviseOpt) => (
                  <MenuItem key={deviseOpt} value={deviseOpt}>
                    {deviseOpt}
                  </MenuItem>
                ))}
              </TextField>
            )}
          </>
        )}

        <TextField
          label="Commentaire"
          multiline
          rows={3}
          fullWidth
          {...register('commentaire')}
          sx={{ mb: 0 }}
        />
        </form>
      </Paper>
    </Modal>
  )
}

export default OperationModal
