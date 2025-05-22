import axios from 'axios'

export const api = axios.create({
baseURL: 'https://corridacreaapi.crea-rn.org.br/api',
})