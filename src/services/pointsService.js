import api from './api'

export const pointsServiceService = {
  getAll: async () => {
    const response = await api.get('/points-service')
    return response.data || response
  },

  getById: async (id) => {
    const response = await api.get(`/points-service/${id}`)
    return response.data
  },

  create: async (data) => {
    const response = await api.post('/points-service', data)
    return response.data
  },

  update: async (id, data) => {
    const response = await api.put(`/points-service/${id}`, data)
    return response.data
  },

  delete: async (id) => {
    const response = await api.delete(`/points-service/${id}`)
    return response.data
  }
}
