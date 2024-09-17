import { Telegraf } from "telegraf";
import { prisma } from "@config/prisma";

export async function envioMensagemBotTelegran(inspectorateId) {
  const bot = new Telegraf(process.env.TELEGRAN_SECRET);

  const data = await prisma.scheduling.findFirst({
    where: {
      id: inspectorateId,
    },
    include: {
      admin: {
        select: {
          name: true,
        },
      },
      inspectorate: {
        select: {
          name: true,
        },
      },
      room: true,
    },
  });

  const idAdminTelegram = await prisma.admin.findFirst({
    where:{
      inspectorateId: data.inspectorateId,
      notification: true,
      idTelegran: {
        not: null
      }   
    },
    select:{
      idTelegran: true,
      name: true
    }
  });

  // Verificar se idAdminTelegram e idTelegran existem
  if (idAdminTelegram && idAdminTelegram.idTelegran) {
    function formatarData(dataCompleta) {
      // Dividir a string da data nos espaços
      const partes = dataCompleta.split(" ");

      // A parte desejada é a primeira parte (índice 0)
      const data = partes[0];
      return data;
    }

    const message = `
      Olá, ${idAdminTelegram.name}
      Existe um agendamento pendente para o Coworking ${data.inspectorate.name}
      
      * Profissional: ${data.nameProfissional}
      * Título: ${data.tituloPrincipalProfissional}
      * Data: ${formatarData(data.createdAt)}
      * Sala: ${data.room.name}
      * Horário: ${data.hourInitial}hs as ${data.hourFinish}hs
      
      Para aprovar o agendamento, acesse o link a seguir:

      https://coworking.crea-rn.org.br/administrar_agendamentos
    `;
    
    // Enviar a mensagem apenas se idAdminTelegram.idTelegran existir
    bot.telegram.sendMessage(idAdminTelegram.idTelegran, message);
  }

  return;
}

