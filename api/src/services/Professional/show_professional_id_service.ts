import db from '../../config/db';
import db_rh from '../../config/db_rh';
import AppError from '../../error/AppError';

export class ShowProfessionalIdService {
  async execute(cpf: string) {
    // Consultar na base de dados RH
    const response_servidor = await db_rh.query(
      `
      SELECT 
        DISTINCT 
        r.servidor, 
        r.cpf,  
        r.email        
      FROM rh r
      WHERE r.cpf = $1`,
      [cpf]
    );

    if (response_servidor.rows.length > 0) {
      const servidor = response_servidor.rows[0];
      return {
        nome: servidor.servidor,
        email: servidor.email,
        cpf: servidor.cpf,
        cat: "- Funcionário/CREA-RN/Multua"       
      };
    }

    // Consultar na base de dados de relatórios
    const res = await db.query(
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
      LEFT JOIN tb_tiporegistro tr ON tr.codigo = r.tipo_registro
      LEFT JOIN tb_modalidadeatribuicao ma ON ma.id = t.modalidaatribuicao_id
      LEFT JOIN tb_profissional pf ON pf.pessoa_id = r.pessoa_id
      LEFT JOIN tb_pessoa p ON p.id = pf.pessoa_id
      LEFT JOIN tb_filial f ON f.descricao = r.filial
      WHERE pf.cpf = $1`,
      [cpf]
    );

    if (res.rows.length > 0) {
      const profissional = res.rows[0];
      return {
        nome: profissional.nome,
        email: profissional.email,
        cpf: profissional.cpf,
        titulo_principal: profissional.titulo_principal,
        cat: "- Profissional sistema CREA-RN"
      };
    }

    // Se não encontrou nenhum profissional, lance uma exceção
    throw new AppError('Nenhum profissional encontrado com o CPF informado.');
  }
}
