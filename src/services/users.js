import api from './api'

export const usersService = {
  getAll: async (filters = {}) => {
    // Filtrer les paramètres vides
    const cleanFilters = {}
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        cleanFilters[key] = filters[key]
      }
    })
    
    // Log pour debug
    const baseURL = api.defaults.baseURL || 'http://localhost:5000/api'
    const fullURL = `${baseURL}/users`
    console.log('🔍 Appel API Users:', {
      baseURL: baseURL,
      endpoint: '/users',
      fullURL: fullURL,
      filters: cleanFilters
    })
    
    const response = await api.get('/users', { params: cleanFilters })
    // Le backend retourne { success: true, count: X, data: [...] }
    return response.data?.data || response.data || response
  },

  getById: async (id) => {
    const response = await api.get(`/users/${id}`)
    return response.data?.data || response.data || response
  },

  create: async (userData) => {
    const response = await api.post('/users', userData)
    return response.data?.data || response.data || response
  },

  update: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData)
    return response.data?.data || response.data || response
  },

  delete: async (id) => {
    const response = await api.delete(`/users/${id}`)
    return response.data || response
  },

  toggleStatus: async (id) => {
    const response = await api.patch(`/users/${id}/activer`)
    return response.data || response
  },

  resetPassword: async (id, newPassword) => {
    const response = await api.patch(`/users/${id}/reset-password`, { password: newPassword })
    return response.data || response
  }
}
