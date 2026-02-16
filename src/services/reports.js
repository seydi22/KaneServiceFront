import api from './api'

export const reportsService = {
  getJournalier: async (date) => {
    const response = await api.get(`/reports/journalier?date=${date}`)
    return response.data || response
  },

  getHebdomadaire: async (weekStart, weekEnd) => {
    const response = await api.get(`/reports/hebdomadaire?start=${weekStart}&end=${weekEnd}`)
    return response.data || response
  },

  getMensuel: async (month, year) => {
    const response = await api.get(`/reports/mensuel?month=${month}&year=${year}`)
    return response.data || response
  }
}
