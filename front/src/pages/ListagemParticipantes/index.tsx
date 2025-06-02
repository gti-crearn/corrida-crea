import React, { useState } from 'react';
import { api } from '../../services/api';
import { formatarDataParaBR } from '../../utils/data_formatada';

const estiloAnimacao = `
@keyframes continuousShake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  50% { transform: translateX(4px); }
  75% { transform: translateX(-4px); }
  100% { transform: translateX(0); }
}
`;

interface Vouch {
  id: number;
  codigo: string;
  disponivel: boolean;
}

interface Participante {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  data: string;
  vouches: Vouch[];
}

interface ParticipantsResponse {
  participantes: Participante[];
  quantidadeVouchersDisponiveis: number;
}

export function ListagemParticipantsPage() {
  const [participants, setParticipants] = useState<Participante[]>([]);
  const [availableVouchersCount, setAvailableVouchersCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [codigoAutorizacao, setCodigoAutorizacao] = useState<string>('');

  const fetchParticipants = async () => {
    try {
      setLoading(true);
      const response = await api.get<ParticipantsResponse>(
        `corrida/participantes_list`,
        {
          params: { codigo: codigoAutorizacao },
        }
      );

      // Ordena pela data decrescente (mais recente primeiro)
      const participantesOrdenados = [...response.data.participantes].sort((a, b) =>
        new Date(b.data).getTime() - new Date(a.data).getTime()
      );

      setParticipants(participantesOrdenados);
      setAvailableVouchersCount(response.data.quantidadeVouchersDisponiveis);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar os dados dos participantes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    fetchParticipants();
  };

  // Participante mais recente
  const participanteMaisRecenteId = participants[0]?.id;

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: 24 }}>
      <style>{estiloAnimacao}</style>

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 12,
          marginBottom: 24,
        }}
      >
        <label htmlFor="codigoAutorizacao" style={{ fontSize: 16, fontWeight: 'bold' }}>
          Código de Autorização:
        </label>
        <input
          type="password"
          id="codigoAutorizacao"
          value={codigoAutorizacao}
          onChange={(e) => setCodigoAutorizacao(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #ccc',
            borderRadius: 4,
            minWidth: 200,
          }}
        />
        <button
          type="submit"
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          Buscar
        </button>
      </form>

      {loading && <p style={{ textAlign: 'center' }}>Carregando...</p>}
      {error && <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>}

      {!loading && participants.length > 0 && (
        <>
          <h2
            style={{
              textAlign: 'center',
              fontSize: 20,
              fontWeight: 'bold',
              marginBottom: 8,
              color: '#007bff',
            }}
          >
            Vouchers disponíveis: {availableVouchersCount}
          </h2>

          <p style={{ textAlign: 'center', marginBottom: 24 }}>
            Total de participantes: <strong>{participants.length}</strong>
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {participants.map((participant) => {
              const isMaisRecente = participant.id === participanteMaisRecenteId;

              return (
                <div
                  key={participant.id}
                  style={{
                    border: isMaisRecente ? '2px solid oklch(70.7% 0.165 254.624)' : '1px solid #ccc',
                    borderRadius: 8,
                    padding: 16,
                    backgroundColor: isMaisRecente ? 'oklch(93.2% 0.032 255.585)' : '#fafafa',
                    animation: isMaisRecente ? 'continuousShake 1s infinite' : undefined,
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <h3 style={{ marginBottom: 4, fontSize: 18 }}>{participant.nome}</h3>
                  <p style={{ margin: 2 }}><strong>Cadastrado em:</strong> {formatarDataParaBR(participant.data)}</p>
                  <p style={{ margin: 2 }}><strong>Email:</strong> {participant.email}</p>
                  <p style={{ margin: 2 }}><strong>CPF:</strong> {participant.cpf}</p>
                  <div style={{ marginTop: 10 }}>
                    <strong>Voucher: {participant.vouches[0]?.codigo ?? '—'}</strong>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
