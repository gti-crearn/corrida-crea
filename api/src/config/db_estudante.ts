import {Pool} from'pg'

import dotenv from 'dotenv';

dotenv.config();

// ==> Conexão com a Base de Dados:
const pool = new Pool({
  connectionString: process.env.DATABASE_AGENDAMENTO
});

pool.connect(()=>{
  console.log('Base de Dados corrida conectado com sucesso!');
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};