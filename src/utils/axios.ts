import Axios from 'axios'

const axios = Axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
  withCredentials: true,
})

export { axios }
