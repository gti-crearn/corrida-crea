import { PrismaClient} from '@prisma/client';
const nodemailer = require("nodemailer");
import AppError from '../../error/AppError'

const prisma = new PrismaClient();

// Interface para os dados do participante
interface ParticipanteInput {
    nome: string;
    email: string;
    cpf: string;
}

// Função para enviar email
async function sendEmail(participanteEmail: string, participanteNome: string, vouchCodes: string): Promise<void> {
    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: false,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    const mailOptions = {
        from: {
            address: "noreply@crea-rn.org.br",
            name: "Vouches - Corrida do CREA-RN",
        },
        to: participanteEmail,
        subject: 'Seus Códigos de Vouch',
       // text: `Olá ${participanteNome}, aqui estão seus códigos de vouch para sua inscrição na corrida do CREA-RN: ${vouchCodes}`,
       html: `
       <!DOCTYPE html>
       <html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Corrida CREA-RN</title>
        
</head>

<body style="font-family: Arial, sans-serif;">
    <div style="width: 100%; display: flex; justify-content: center; ">
        <img src="https://crea-rn.org.br/wp-content/uploads/2024/09/Banner-Corrida-SITE.jpg"
            style="height:15rem; object-fit: cover; width: 70%; border-radius: 8px;" alt="Logo" class="footer-logo">
    </div>
    <div style="width: 100%; display: flex; justify-content: center; margin-top: 1rem;">
        <h2> Olá, ${participanteNome}</h2>
    </div>
    <div class="message">
        <p>Aqui estão seus códigos de voucher, que garantem 50% de desconto para sua inscrição e a de um convidado na
            corrida do CREA-RN. </p>

    </div>
    <table>
        <td>
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <h2 style="color: blue; font-weight: bold;"> ${vouchCodes}</h2>
            </div>
            <p>Clique no link abaixo para fazer sua inscrição</p>
            <a href="https://site.ticketsports.com.br/Inscricao/categoria.aspx?__idEvento=69667&origem=ticketsports&lang=pt-BR#" style="color: blue; text-decoration: none;"> 
                <button style="cursor: pointer;background-color: #1d4ed8; color: white; padding: 0.5rem; border:0; width: 200px;">Inscreva-se</button>
            </a>
        </td>
        </tr>
    </table>
    <div style="margin-top: 2rem;">
        <strong>Para mais informações,</strong>
         <div style="margin-top: 1rem;">
            <p >Telefone: (84) 4006-7219 / Zap (84) 99128-3827</p>
            <p>Conselho Regional de Engenharia e Agronomia do RN – Crea-RN</p>
            <p>Avenida Senador Salgado Filho, 1840 - Lagoa Nova, Natal - RN, 59056-000</p>
        </div>
        <div>

            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMbgBihpJi5cwP3OvF4_Lo4CHGCsPvyh72fEHtPuFm&s "
                style="width: 250px;" alt="">
        </div>

    </div>
</body>

</html>
   `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('E-mail enviado com sucesso!');
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
        throw new Error('Erro no envio de e-mail');
    }
}
const anoAtual = new Date().getFullYear();
export const criarParticipante = async (dados: ParticipanteInput) => {
    // 1. Verifica se já existe um participante com o mesmo CPF ou email
    const participanteExistente = await prisma.participante.findFirst({
        where: {
          AND: [
            {
              OR: [
                { email: dados.email },
                { cpf: dados.cpf },
              ],
            },
            {
              data: {
                gte: new Date(`${anoAtual}-01-01T00:00:00.000Z`),
                lt: new Date(`${anoAtual + 1}-01-01T00:00:00.000Z`),
              },
            },
          ],
        },
      });
    if (participanteExistente) {
        throw new AppError('Já existe um participante cadastrado com este e-mail ou CPF. O voucher já foi enviado para o e-mail registrado.', 400);
    }
    // 2. Cria um participante
    const participante = await prisma.participante.create({
        data: {
            nome: dados.nome,
            email: dados.email,
            cpf: dados.cpf,
        },
    });

    // 3. Busca um vouche disponíveis
    const vouchesDisponiveis = await prisma.vouch.findMany({
        where: {
            disponivel: true,
        },
        take: 1,
    });

    if (vouchesDisponiveis.length < 1) {
        throw new AppError('Não há vouches suficientes disponíveis.');
    }

    // 4. Atualiza os dois vouches para associar ao participante e setar como indisponíveis
    await prisma.vouch.updateMany({
        where: {
            id: {
                in: vouchesDisponiveis.map((vouch) => vouch.id),
            },
        },
        data: {
            disponivel: false,
            participanteId: participante.id, // Associa os vouches ao participante
        },
    });

    const vouchCodes = vouchesDisponiveis.map((vouch) => vouch.codigo).join(', ');

    // 5. Envia o email para o participante com os dois códigos de vouch
    await sendEmail(participante.email, participante.nome, vouchCodes);

    return { participante, vouches: vouchCodes };
};
