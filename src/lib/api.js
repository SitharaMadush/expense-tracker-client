import Axios from 'axios'

const api = Axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost/api/v1',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  config.headers.Accept = 'application/json'
  return config
})

export default api
