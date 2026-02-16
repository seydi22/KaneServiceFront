import api from './api'

export const dashboardService = {
  getAgentDashboard: async (filters = {}) => {
    const params = new URLSearchParams()
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key])
      }
    })
    const response = await api.get(`/dashboard/agent?${params.toString()}`)
    // L'API retourne { success: true, data: {...} }
    return response.data?.data || response.data || response
  },

  getAdminDashboard: async (filters = {}) => {
    const params = new URLSearchParams()
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key])
      }
    })
    const response = await api.get(`/dashboard/admin?${params.toString()}`)
    // L'API retourne { success: true, data: {...} }
    return response.data?.data || response.data || response
  }
}
