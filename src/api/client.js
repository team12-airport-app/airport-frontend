import axios from 'axios'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE?.replace(/\/+$/, ''),
  timeout: 10000,
})

export default client
