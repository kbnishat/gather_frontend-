//local
 const API_BASE_URL = 'http://localhost:3000/api/v1'
//const API_BASE_URL = 'https://nishat-s-verisity-project.vercel.app/api/v1'
let accessToken = null
let refreshPromise = null

const parseResponse = async (response) => {
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    const details = Array.isArray(payload.error) ? payload.error.map((item) => `${item.path || 'field'}: ${item.message}`).join(', ') : ''
    const error = new Error(details || payload.message || 'The request could not be completed.')
    error.status = response.status
    throw error
  }
  return payload
}

export const setAccessToken = (token) => { accessToken = token }
export const clearAccessToken = () => { accessToken = null }

async function refreshAccessToken() {
  if (!refreshPromise) refreshPromise = fetch(`${API_BASE_URL}/auth/refresh-token`, { method: 'POST', credentials: 'include' }).then(parseResponse).then((payload) => { accessToken = payload.accessToken || payload.data?.accessToken; return accessToken }).finally(() => { refreshPromise = null })
  return refreshPromise
}

export async function apiRequest(path, options = {}, canRefresh = true) {
  const headers = { ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }), ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}), ...options.headers }
  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers, credentials: 'include' })
  if (response.status === 401 && canRefresh) {
    try { await refreshAccessToken(); return apiRequest(path, options, false) } catch (error) { clearAccessToken(); localStorage.removeItem('event_access_token'); throw error }
  }
  return parseResponse(response)
}

export const authApi = {
  login: async (credentials, remember = false) => { const payload = await apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }, false); const token = payload.accessToken || payload.data?.accessToken || payload.data?.data?.accessToken; setAccessToken(token); if (remember) { localStorage.setItem('event_access_token', token); localStorage.setItem('event_session', JSON.stringify(payload.user || payload.data?.user || payload.data?.data?.user || {})) } return payload },
  restore: () => { const token = localStorage.getItem('event_access_token'); if (token) setAccessToken(token); return Boolean(token) },
  savedSession: () => { try { return JSON.parse(localStorage.getItem('event_session') || 'null') } catch { return null } },
  register: (data) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(data) }, false),
  forgotPassword: (id) => apiRequest('/auth/forget-password', { method: 'POST', body: JSON.stringify({ id }) }, false),
  logout: async () => { try { await apiRequest('/auth/logout', { method: 'POST' }, false).catch(() => {}) } finally { clearAccessToken(); localStorage.removeItem('event_access_token'); localStorage.removeItem('event_session') } },
  profile: () => apiRequest('/users/get-my-profile'),
}

const eventForm = (data, image) => {
  const form = new FormData()
  Object.entries(data).forEach(([key, value]) => { if (value !== undefined && value !== null && value !== '') form.append(key, String(value)) })
  if (image) form.append('image', image)
  return form
}

export const eventApi = {
  list: (query = '') => apiRequest(`/events${query ? `?${query}` : ''}`),
  get: (id) => apiRequest(`/events/${id}`),
  create: (data, image) => apiRequest('/events', { method: 'POST', body: eventForm(data, image) }),
  update: (id, data, image) => apiRequest(`/events/${id}`, { method: 'PATCH', body: eventForm(data, image) }),
  remove: (id) => apiRequest(`/events/${id}`, { method: 'DELETE' }),
}
const adForm = (title, link, image) => { const form = new FormData(); if (title !== undefined) form.append('title', title); if (link !== undefined) form.append('link', link); if (image) form.append('image', image); return form }
export const adApi = {
  list: () => apiRequest('/ads'),
  get: (id) => apiRequest(`/ads/${id}`),
  create: (title, link, image) => apiRequest('/ads', { method: 'POST', body: adForm(title, link, image) }),
  update: (id, title, link, image) => apiRequest(`/ads/${id}`, { method: 'PATCH', body: adForm(title, link, image) }),
  remove: (id) => apiRequest(`/ads/${id}`, { method: 'DELETE' }),
}
export const userApi = {
  list: (query = '') => apiRequest(`/users/get-all-users${query ? `?${query}` : ''}`),
  get: (id) => apiRequest(`/users/get-user/${id}`),
  update: (id, data) => apiRequest(`/users/update-user/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  updateMyProfile: (data, image) => { const form = new FormData(); Object.entries(data).forEach(([key, value]) => { if (value !== undefined && value !== null && value !== '') form.append(key, String(value)) }); if (image) form.append('image', image); return apiRequest('/users/update-my-profile', { method: 'PATCH', body: form }) },
}
export const registrationApi = {
  list: (query = '') => apiRequest(`/event-registrations${query ? `?${query}` : ''}`),
  byEvent: (eventId) => apiRequest(`/event-registrations/event/${eventId}`),
  mine: (query = '') => apiRequest(`/event-registrations/mine${query ? `?${query}` : ''}`),
  create: (data) => apiRequest('/event-registrations', { method: 'POST', body: JSON.stringify(data) }),
  remove: (eventId) => apiRequest(`/event-registrations/${eventId}`, { method: 'DELETE' }),
  dashboard: () => apiRequest('/event-registrations/dashboard'),
}

export const savedEventApi = {
  list: () => apiRequest('/saved-events/mine'),
  get: (eventId) => apiRequest(`/saved-events/${eventId}`),
  save: (eventId) => apiRequest('/saved-events', { method: 'POST', body: JSON.stringify({ eventId }) }),
  remove: (eventId) => apiRequest(`/saved-events/${eventId}`, { method: 'DELETE' }),
}

export const contactApi = {
  list: () => apiRequest('/contacts'),
  get: (id) => apiRequest(`/contacts/${id}`),
  create: (data) => apiRequest('/contacts', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/contacts/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  remove: (id) => apiRequest(`/contacts/${id}`, { method: 'DELETE' }),
}
