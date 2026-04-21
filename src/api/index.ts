const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

interface FetchOptions extends RequestInit {
  params?: Record<string, string>
}

async function request<T>(url: string, options: FetchOptions = {}): Promise<T> {
  const { params, headers: customHeaders, ...rest } = options

  // Build URL with query params
  const fullUrl = new URL(url.startsWith('http') ? url : `${API_BASE}${url}`)
  if (params) {
    Object.entries(params).forEach(([k, v]) => fullUrl.searchParams.set(k, v))
  }

  // Get token from localStorage
  const token = localStorage.getItem('vl-token')

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(customHeaders as Record<string, string>),
  }

  const response = await fetch(fullUrl.toString(), {
    ...rest,
    headers,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || `HTTP ${response.status}`)
  }

  return data
}

export const api = {
  get: <T>(url: string, params?: Record<string, string>) =>
    request<T>(url, { method: 'GET', params }),

  post: <T>(url: string, body?: any) =>
    request<T>(url, { method: 'POST', body: JSON.stringify(body) }),

  put: <T>(url: string, body?: any) =>
    request<T>(url, { method: 'PUT', body: JSON.stringify(body) }),

  patch: <T>(url: string, body?: any) =>
    request<T>(url, { method: 'PATCH', body: JSON.stringify(body) }),

  delete: <T>(url: string) =>
    request<T>(url, { method: 'DELETE' }),
}

// Auth API
export const authApi = {
  login: (data: { name: string; schoolId: string; role: 'student' | 'teacher' }) =>
    api.post<{ user: any; token: string }>('/auth/login', data),

  register: (data: { name: string; schoolId: string; role: 'student' | 'teacher'; grade?: string; classNo?: string }) =>
    api.post<{ user: any; token: string }>('/auth/register', data),

  getMe: () => api.get<any>('/auth/me'),
}

// Experiments API
export const experimentsApi = {
  getAll: (params?: { subject?: string; grade?: string }) =>
    api.get<any[]>('/experiments', params),

  getById: (id: string) => api.get<any>(`/experiments/${id}`),

  getEquipment: () => api.get<any[]>('/experiments/equipment/catalog'),
}

// Tasks API
export const tasksApi = {
  getAll: () => api.get<any[]>('/tasks'),
  create: (data: any) => api.post<any>('/tasks', data),
  update: (id: string, data: any) => api.put<any>(`/tasks/${id}`, data),
  publish: (id: string) => api.patch<any>(`/tasks/${id}/publish`),
  delete: (id: string) => api.delete<any>(`/tasks/${id}`),
}

// Reports API
export const reportsApi = {
  getAll: (params?: { status?: string }) => api.get<any[]>('/reports', params),
  getById: (id: string) => api.get<any>(`/reports/${id}`),
  submit: (data: any) => api.post<any>('/reports', data),
  grade: (id: string, data: { score: number; comment?: string }) =>
    api.patch<any>(`/reports/${id}/grade`, data),
  delete: (id: string) => api.delete<any>(`/reports/${id}`),
}
