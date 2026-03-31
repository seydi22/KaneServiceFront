export const formatCurrency = (amount, currency = 'XOF') => {
  const num = amount != null && !Number.isNaN(Number(amount)) ? Number(amount) : 0
  try {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency
    }).format(num)
  } catch {
    return `${new Intl.NumberFormat('fr-FR').format(num)} ${currency === 'MRU' ? 'MRU' : 'F CFA'}`
  }
}

export const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export const formatDateTime = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const formatDateShort = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

/** Résumé textuel du montant selon le type d'opération (liste, exports, rapports). */
export const formatOperationMontantResume = (op) => {
  if (!op) return 'N/A'
  if (op.service === 'Change' && (op.categorie === 'Vente' || op.categorie === 'Achat')) {
    const d = op.deviseChange || '—'
    const sym = d === 'USD' ? '$' : d === 'EUR' ? '€' : ''
    const ext = op.montantDeviseEtrangere != null
      ? `${new Intl.NumberFormat('fr-FR').format(Number(op.montantDeviseEtrangere))} ${d}${sym ? ` (${sym})` : ''}`
      : '—'
    const mru = op.montantMru != null
      ? `${new Intl.NumberFormat('fr-FR').format(Number(op.montantMru))} MRU`
      : '—'
    return `${op.categorie} · ${ext} → ${mru}`
  }
  if (op.montantFcfa != null || op.montantOuguiya != null) {
    const fcfa = op.montantFcfa != null ? `${op.montantFcfa} XOF` : '0 XOF'
    const mru = op.montantOuguiya != null ? `${op.montantOuguiya} MRU` : '0 MRU'
    return `FCFA: ${fcfa} | Ouguiya: ${mru}`
  }
  if (op.montantRecu != null && op.montantEnvoye != null) {
    return `Reçu: ${op.montantRecu} ${op.deviseRecu || ''} | Envoyé: ${op.montantEnvoye} ${op.deviseEnvoye || ''}`
  }
  if (op.montant != null) {
    return `${op.montant} ${op.devise || 'XOF'}`
  }
  return 'N/A'
}
