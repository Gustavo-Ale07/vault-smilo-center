import { useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'

// In development, use relative path to leverage Vite proxy
// In production, use the configured API URL
const API_URL = import.meta.env.MODE === 'development' 
  ? '/api/v1' 
  : import.meta.env.VITE_API_URL || '/api/v1'

let tokenGetter = null

export function setTokenGetter(getter) {
  tokenGetter = getter
}

async function getAuthToken() {
  if (!tokenGetter) return null
  return tokenGetter()
}

async function fetchWithAuth(endpoint, options = {}) {
  const token = await getAuthToken()
  const headers = { ...options.headers }

  const isFormData = options.body instanceof FormData
  if (!isFormData) {
    headers['Content-Type'] = 'application/json'
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => null)
    const message = errorPayload?.error || `HTTP ${response.status}`
    throw new Error(message)
  }

  return response.json()
}

export function useApiAuth() {
  const { getToken } = useAuth()

  useEffect(() => {
    setTokenGetter(() => getToken())
  }, [getToken])
}

export const api = {
  getMe: () => fetchWithAuth('/me'),
  updateMe: (data) =>
    fetchWithAuth('/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  getSubscriptions: () => fetchWithAuth('/subscriptions'),
  getSubscription: (id) => fetchWithAuth(`/subscriptions/${id}`),
  getSubscriptionPassword: (id) => fetchWithAuth(`/subscriptions/${id}/password`),
  createSubscription: (data) =>
    fetchWithAuth('/subscriptions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateSubscription: (id, data) =>
    fetchWithAuth(`/subscriptions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteSubscription: (id) =>
    fetchWithAuth(`/subscriptions/${id}`, {
      method: 'DELETE',
    }),

  getVaultAccounts: () => fetchWithAuth('/vault-accounts'),
  getVaultAccount: (id) => fetchWithAuth(`/vault-accounts/${id}`),
  getVaultAccountPassword: (id) => fetchWithAuth(`/vault-accounts/${id}/password`),
  createVaultAccount: (data) =>
    fetchWithAuth('/vault-accounts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateVaultAccount: (id, data) =>
    fetchWithAuth(`/vault-accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteVaultAccount: (id) =>
    fetchWithAuth(`/vault-accounts/${id}`, {
      method: 'DELETE',
    }),

  getCategories: () => fetchWithAuth('/categories'),
  createCategory: (data) =>
    fetchWithAuth('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateCategory: (id, data) =>
    fetchWithAuth(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteCategory: (id) =>
    fetchWithAuth(`/categories/${id}`, {
      method: 'DELETE',
    }),

  getTransactions: (params) => {
    const query = new URLSearchParams(params || {}).toString()
    return fetchWithAuth(`/transactions${query ? `?${query}` : ''}`)
  },
  getTransactionsSummary: (params) => {
    const query = new URLSearchParams(params || {}).toString()
    return fetchWithAuth(`/transactions/summary${query ? `?${query}` : ''}`)
  },
  createTransaction: (data) =>
    fetchWithAuth('/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateTransaction: (id, data) =>
    fetchWithAuth(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteTransaction: (id) =>
    fetchWithAuth(`/transactions/${id}`, {
      method: 'DELETE',
    }),

  getInvestments: () => fetchWithAuth('/investments'),
  getInvestment: (id) => fetchWithAuth(`/investments/${id}`),
  getInvestmentProjection: (id) => fetchWithAuth(`/investments/${id}/projection`),
  createInvestment: (data) =>
    fetchWithAuth('/investments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateInvestment: (id, data) =>
    fetchWithAuth(`/investments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteInvestment: (id) =>
    fetchWithAuth(`/investments/${id}`, {
      method: 'DELETE',
    }),

  importCSV: async (file) => {
    const formData = new FormData()
    formData.append('file', file)

    return fetchWithAuth('/import/csv', {
      method: 'POST',
      body: formData,
    })
  },
}

export default api
