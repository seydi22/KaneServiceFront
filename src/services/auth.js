import api from './api'

export const authService = {
  login: async (matricule, password) => {
    const response = await api.post('/auth/login', { matricule, password })
    return response.data
  },

  getMe: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }
}
