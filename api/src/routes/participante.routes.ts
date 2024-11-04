
import { listParticipantesComVouchers } from '../services/Professional/get_participantes_vonchers';
import { criarParticipante } from '../services/participantes/participantes_services';
import { Request, Response, Router } from 'express'


const participanteRouter = Router()

participanteRouter.post('/participantes', async (req: Request, res: Response) => {
      const response = await criarParticipante(req.body);
      res.status(200).json(response);
  
  });

  // Rota para listar participantes e seus vouchers
participanteRouter.get('/participantes_list', async (req: Request, res: Response) => {
  const { codigo } = req.query; // Pega o código da query string
  try {
    const participantes = await listParticipantesComVouchers(codigo);
    res.status(200).json(participantes);
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
});

  
export default participanteRouter