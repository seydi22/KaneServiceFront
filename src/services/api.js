import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL !== undefined && import.meta.env.VITE_API_URL !== ''
  ? import.meta.env.VITE_API_URL
  : (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api')

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Intercepteur pour gérer les erreurs et expiration du token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Gérer les erreurs 401 (non autorisé)
    if (error.response?.status === 401) {
      // Ne rediriger que si on n'est pas déjà sur la page de login
      if (window.location.pathname !== '/login') {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        // Utiliser replace pour éviter d'ajouter à l'historique
        window.location.replace('/login')
      }
    }
    // Gérer les erreurs réseau (pas de réponse du serveur)
    if (!error.response && error.request) {
      console.error('Erreur réseau: Impossible de contacter le serveur')
      // Ne pas rediriger en cas d'erreur réseau, juste logger
    }
    return Promise.reject(error)
  }
)

export default api
