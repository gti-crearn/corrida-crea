import 'express-async-errors'
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express'
import AppError from './error/AppError'
import routes from './routes'
import ejs from 'ejs'

const app = express()
app.set('view engine', ejs);

app.use(cors())
app.use(express.json())
app.use(routes)

//tratamento de error
app.use(
  (
    error: Error,
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    if (error instanceof AppError) {
      return response.status(error.statusCode).json({
        status: 'error',
        message: error.message
      })
    }
    return response.status(500).json({
      status: 'error',
      message: 'Erro Interno do servidor'

    })
  }
)

app.listen(5000, ()=> console.log('Servidor rodando'))
