// participanteService.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Função que lista todos os participantes cadastrados,
 * incluindo os vouchers associados a cada participante,
 * oculta os últimos 5 dígitos do código do voucher e inclui
 * a quantidade de vouchers disponíveis.
 * @returns {Promise<Object>} Lista de participantes com seus vouchers e a contagem de vouchers disponíveis.
 */
export async function listParticipantesComVouchers(codigo) {
    try {

        // Verifica o código fornecido com o código no .env
        const codigoEsperado = process.env.CODIGO_AUTORIZACAO;
        if (codigo !== codigoEsperado) {
            throw new Error('Código de autorização inválido.');
        }

        const anoAtual = new Date().getFullYear();
        const inicioAno = new Date(anoAtual, 0, 1);        // 1º de janeiro, 00:00:00
        const fimAno = new Date(anoAtual + 1, 0, 1);        // 1º de janeiro do próximo ano


        // Consulta todos os participantes e seus vouchers relacionados
        const participantes = await prisma.participante.findMany({
            where: {
                data: {
                    gte: inicioAno,
                    lt: fimAno,
                },
            },
            include: {
                vouches: true,
            },
            orderBy: {
                data: 'desc', // ou 'asc' se quiser do mais antigo ao mais recente
              },
        });

        // Conta a quantidade de vouchers disponíveis
        const quantidadeVouchersDisponiveis = await prisma.vouch.count({
            where: { disponivel: true },
        });

        // Aplica a máscara aos códigos dos vouchers
        const participantesComVouchersMascarados = participantes.map(participante => ({
            ...participante,
            cpf: participante.cpf.slice(0, -5) + '*****',
            vouches: participante.vouches.map(vouch => ({
                ...vouch,
                codigo: vouch.codigo.slice(0, -5) + '*****', // Mascarando os últimos 5 dígitos
            })),
        }));

        // Retorna os participantes com seus vouchers e a quantidade de vouchers disponíveis
        return {
            quantidadeVouchersDisponiveis,
            participantes: participantesComVouchersMascarados,

        };
    } catch (error) {
        console.error('Erro ao listar participantes:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}