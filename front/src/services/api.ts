import axios from 'axios'

export const api = axios.create({
//baseURL: 'http://localhost:3333/api/',
baseURL: 'https://corridacreaapi.crea-rn.org.br/api',
})