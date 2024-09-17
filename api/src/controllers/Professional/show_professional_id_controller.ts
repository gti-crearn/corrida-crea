
import { ShowProfessionalIdService } from "../../services/Professional/show_professional_id_service";
import { Request, Response } from "express";


export class ShowProfessionalController {
  async handle(request: Request, response: Response) {
    const { cpf } = request.params
    const service = new ShowProfessionalIdService()

    const res = await service.execute(cpf)

    return response.status(201).json(res)
  }
}
