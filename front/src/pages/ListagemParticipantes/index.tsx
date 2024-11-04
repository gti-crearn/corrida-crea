import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { api } from '../../services/api';

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
    const [codigoAutorizacao, setCodigoAutorizacao] = useState<string>(''); // Estado para o código de autorização



    // useEffect(() => {
    //     const fetchParticipants = async () => {

    //     };

    //     fetchParticipants();
    // }, []);

    if (loading) return <p>Carregando...</p>;
    if (error) return <p>{error}</p>;

    // Função para buscar participantes
    const fetchParticipants = async () => {
        try {
            setLoading(true);
            const response = await api.get<ParticipantsResponse>(
                `corrida/participantes_list`,
                {
                    params: { codigo: codigoAutorizacao },
                }
            );

            console.log(response.data)
            setParticipants(response.data.participantes);
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
        fetchParticipants(); // Chama a função para buscar participantes com o código de autorização inserido
    };

    return (
        <div>
            <form onSubmit={handleSubmit} style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", padding: "2rem" }}>
                <label htmlFor="codigoAutorizacao">Código de Autorização:</label>
                <input
                    type="password"
                    id="codigoAutorizacao"
                    value={codigoAutorizacao}
                    onChange={(e) => setCodigoAutorizacao(e.target.value)}
                />
                <button type="submit">Buscar</button>
            </form>

            {loading ? (
                <p>Carregando ...</p>
            ) : (
                <>
                    {participants.length > 0 && (
                        <>
                            <h2 style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", padding:"1rem" }} >VOUCHERS DISPONIVEIS : {availableVouchersCount}</h2>

                            <ul style={{ display: "flex", flexDirection:"column", justifyContent: "center", alignItems: "center", border: "1px solid gray", width: "100%" }}>
                                <div>
                                    <h4>TOTAL DE PARTICIPANTES  <strong> {participants.length}  </strong>  </h4>
                                </div>
                                {participants.map((participant) => (
                                    <li key={participant.id} style={{width:"100%", border: "1px solid gray", padding: "1rem" }}>
                                        <strong>{participant.nome}</strong>
                                        <p>Email: {participant.email}</p>
                                        <p>CPF: {participant.cpf}</p>
                                        <strong>Vouchers:</strong>
                                        <ul style={{ marginTop: "-0.5rem" }}>
                                            {participant.vouches.map((vouch) => (
                                                <li key={vouch.id}>
                                                    <span>Código: {vouch.codigo}</span>
                                                    {/* <span> - Disponível: {vouch.disponivel ? 'Sim' : 'Não'}</span> */}
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </>
            )}
        </div>
    );
};


