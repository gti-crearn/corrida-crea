
import { Router } from 'express'


import professionalRouter from './professional.routes'
import participanteRouter from './participante.routes'


const routes = Router()

routes.use("/api/profissional", professionalRouter)
routes.use("/api/corrida", participanteRouter)

export default routes
