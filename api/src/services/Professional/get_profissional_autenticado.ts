import { obterTokenAuthSitac } from "../../config/token_api_auth_sitac";
import axios from "axios";
import { Router } from "express";
import { convertToMD5 } from "../../utils/convertPasswordMD5";

const autenticarProfissionalSitac = Router();
// Rota para fazer a requisição à API SITAC para buscar um profissional
export default autenticarProfissionalSitac.post(
  "/autenticar",
  async (req, res) => {
    try {
      const token = await obterTokenAuthSitac();

      // Parâmetros da requisição
      const tipo_pessoa = req.body.tipo_pessoa;
      const cpfcnpj = req.body.cpfcnpj;
      const senha = req.body.senha;

      const senhaMD5 = convertToMD5(senha);

      // URL da API externa
      const apiUrl = `https://crea-rn.sitac.com.br/app/webservices/movel/getPessoaByTipoPessoaCpfCnpj?tipo_pessoa=${tipo_pessoa}&cpfcnpj=${cpfcnpj}&senha=${senhaMD5}`;

      // Configuração do cabeçalho com o token
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // Faz a requisição à API externa
      const response = await axios.get(apiUrl, { headers });
      console.log(response.data)

      // Retorna a resposta da API externa como resposta da sua rota
    res.status(response.status).json(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Trate o erro 404 aqui, se desejar
        res.status(404).json({ error:  "Falha na autenticação, verifique suas credenciais e tente novamente." });
      } else {
        console.error(error);
        res
          .status(500)
          .json({ error: "Status 500, Erro ao fazer a requisição à API externa" });
      }
    }
  }
);
