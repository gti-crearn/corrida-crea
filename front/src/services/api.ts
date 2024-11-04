import axios from 'axios'

export const api = axios.create({
//baseURL: 'http://localhost:4000/api/',
baseURL: 'https://corridacreaapi.crea-rn.org.br/api',
})