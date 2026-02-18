import api from './api'

const buildParams = (params) => {
  const search = new URLSearchParams()
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v != null && v !== '') search.append(k, v)
  })
  const q = search.toString()
  return q ? `?${q}` : ''
}

export const reportsService = {
  getFiltres: async () => {
    const response = await api.get('/reports/filtres')
    return response.data?.pointsService != null ? response.data : { pointsService: [], agents: [], categories: [] }
  },

  getJournalier: async (date, filters = {}) => {
    const params = { date, ...filters }
    const response = await api.get(`/reports/journalier${buildParams(params)}`)
    return response.data || response
  },

  getHebdomadaire: async (weekStart, weekEnd, filters = {}) => {
    const params = { start: weekStart, end: weekEnd, ...filters }
    const response = await api.get(`/reports/hebdomadaire${buildParams(params)}`)
    return response.data || response
  },

  getMensuel: async (month, year, filters = {}) => {
    const params = { month, year, ...filters }
    const response = await api.get(`/reports/mensuel${buildParams(params)}`)
    return response.data || response
  }
}
