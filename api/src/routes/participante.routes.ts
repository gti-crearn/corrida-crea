
import { criarParticipante } from '../services/participantes/participantes_services';
import { Request, Response, Router } from 'express'


const participanteRouter = Router()

participanteRouter.post('/participantes', async (req: Request, res: Response) => {
      const response = await criarParticipante(req.body);
      res.status(200).json(response);
  
  });

  
export default participanteRouter