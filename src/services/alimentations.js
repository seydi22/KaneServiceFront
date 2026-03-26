import api from './api'

export const alimentationsService = {
  create: async (payload) => {
    const response = await api.post('/alimentations', payload)
    return response.data
  },

  getAll: async (filters = {}) => {
    const params = new URLSearchParams()
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        params.append(key, filters[key])
      }
    })
    const response = await api.get(`/alimentations?${params.toString()}`)
    return response.data
  }
}

