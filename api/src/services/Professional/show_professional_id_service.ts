import db from '../../config/db';
import db_rh from '../../config/db_rh';
import db_estudante from '../../config/db_estudante';
import AppError from '../../error/AppError';

export class ShowProfessionalIdService {
  async execute(cpf: string) {
    try {
      if (!cpf || cpf.trim().length !== 11) {
        throw new AppError('CPF inválido.');
      }

      // 1. Consulta no banco RH
      const response_rh = await db_rh.query(
        `
        SELECT 
          DISTINCT 
          r.servidor AS nome, 
          r.cpf,  
          r.email        
        FROM rh r
        WHERE r.cpf = $1
        `,
        [cpf]
      );

      if (response_rh.rows.length > 0) {
        const servidor = response_rh.rows[0];
        return {
          nome: servidor.nome,
          email: servidor.email,
          cpf: servidor.cpf,
          cat: "- CREA-RN/MÚTUA"
        };
      }

      // 2. Consulta no banco de Relatórios
      const response_prof = await db.query(
        `
        SELECT 
          DISTINCT 
          pf.nome, 
          pf.cpf,  
          p.email,   
          t.titulo_profissional AS titulo_principal   
        FROM relatorios.tb_profissional_report r
        LEFT JOIN tb_profissional_titulo pt ON r.pessoa_id = pt.pessoa_id
        LEFT JOIN tb_titulo t ON t.id = pt.titulo_id
        LEFT JOIN tb_profissional pf ON pf.pessoa_id = r.pessoa_id
        LEFT JOIN tb_pessoa p ON p.id = pf.pessoa_id
        WHERE pf.cpf = $1
        `,
        [cpf]
      );

      if (response_prof.rows.length > 0) {
        const profissional = response_prof.rows[0];
        return {
          nome: profissional.nome,
          email: profissional.email,
          cpf: profissional.cpf,
          titulo_principal: profissional.titulo_principal,
          cat: "- Profissional sistema CREA-RN"
        };
      }

      // 3. Consulta no banco de Estudantes
      const response_estudante = await db_estudante.query(
        `
        SELECT 
          DISTINCT 
          r.nome, 
          r.cpf,  
          r.email        
        FROM student r
        WHERE r.cpf = $1
        `,
        [cpf]
      );

      if (response_estudante.rows.length > 0) {
        const estudante = response_estudante.rows[0];
        return {
          nome: estudante.nome,
          email: estudante.email,
          cpf: estudante.cpf,
          cat: "- Estudante - CREA-JR"
        };
      }

      throw new AppError('Nenhum profissional ou estudante encontrado com o CPF informado.');
    } catch (error) {
      console.error('Erro em ShowProfessionalIdService:', error);
      throw new AppError('Erro ao buscar dados do profissional ou estudante.');
    }
  }
}
