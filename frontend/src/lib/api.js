import axios from 'axios'

// Points at the FastAPI backend. Set VITE_API_URL in .env for deployment.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('gc_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// A 401 means the stored token is invalid/expired — clear the session and
// send the user to login (unless we're already on a public page).
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      const path = window.location.pathname
      const onPublicPage = ['/', '/login', '/signup'].includes(path)
      if (!onPublicPage) {
        localStorage.removeItem('gc_token')
        localStorage.removeItem('gc_user')
        window.location.assign('/login?expired=1')
      }
    }
    return Promise.reject(error)
  },
)

export default api
