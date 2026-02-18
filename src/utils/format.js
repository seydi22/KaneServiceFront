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
