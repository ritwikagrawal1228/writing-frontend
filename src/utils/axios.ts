import Axios from 'axios'

const axios = Axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
  withCredentials: true,
  baseURL: import.meta.env.VITE_API_SERVER_URI,
})

export { axios }
