// auth.js
import axios from "axios";
import https from "https";

const AUTH_BASE_URL = 'https://crea-rn.sitac.com.br/app/webservices/auth/login';

const agent = new https.Agent({
  rejectUnauthorized: true,
});

export async function obterTokenAuthSitac() {

  const grantType = 'client_credentials';
  const scope = 'escopo_scdsrh';

  const formData = new URLSearchParams();
  formData.append('grant_type', grantType);
  formData.append('scope', scope);

  try {
    const response = await axios.post("https://crea-rn.sitac.com.br/app/webservices/auth/login",
      formData.toString(),
      {
        auth: {
          username:process.env.SITAC_CLIENT_ID,
          password:process.env.SITAC_SECRET,
        },
        httpsAgent: agent,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    //console.log(response.data.access_token)
    if (response.status === 200) {      
      return response.data.access_token;     
    } else {
      throw new Error('Erro na requisição');
    }
  } catch (error) {
    
  }
}
