import api from './api'

export const operationsService = {
  create: async (operationData) => {
    const response = await api.post('/operations', operationData)
    return response.data
  },

  getAll: async (filters = {}) => {
    const params = new URLSearchParams()
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        params.append(key, filters[key])
      }
    })
    const response = await api.get(`/operations?${params.toString()}`)
    const body = response.data || {}
    const data = Array.isArray(body.data) ? body.data : (body.data ? [body.data] : [])
    return {
      data,
      total: body.total ?? data.length,
      page: body.page ?? 1,
      pages: body.pages ?? 1,
      count: body.count ?? data.length
    }
  },

  getById: async (id) => {
    const response = await api.get(`/operations/${id}`)
    return response.data
  }
}
