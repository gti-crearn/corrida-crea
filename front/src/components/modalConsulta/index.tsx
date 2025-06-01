import { useState, useEffect } from 'react';
import './styles.css';
import { api } from '../../services/api';
import { maskCpf } from '../../utils/mask_cpf';
import { Tag } from '@phosphor-icons/react';

interface Participante {
    nome: string;
    email: string;
    cpf: string;
    cat?: string;
}

interface ComponenteModalProps {
    show: boolean;
    onHide: () => void;
}

export function ComponenteModal({ show, onHide }: ComponenteModalProps) {
    const [active, setActive] = useState(false);
    const [cpf, setCpf] = useState("");
    const [data, setData] = useState<Participante>({} as Participante);
    const [loading, setLoading] = useState(false);
    const [isloading, setIsLoading] = useState(false);
    const [voucherEmitido, setVoucherEmitido] = useState(false);
    const cpfFormatado = cpf.replace(/[.-]/g, '');

    const [availableVouchersCount, setAvailableVouchersCount] = useState<number>(0);

    // Busca quantidade de vouchers disponíveis
    const fetchParticipants = async () => {
        setLoading(true);
        try {
            const response = await api.get("corrida/participantes_list", {
                params: { codigo: "Corridacrea2025" },
            });
            setAvailableVouchersCount(response.data.quantidadeVouchersDisponiveis);
        } catch (err) {
            console.error('Erro ao carregar os dados dos participantes');
        } finally {
            setLoading(false);
        }
    };

    // Busca profissional pelo CPF
    async function getprofissional() {
        setIsLoading(true);
        try {
            const response = await api.get(`/profissional/${cpfFormatado}`);
            setData(response.data);
        } catch (error: any) {
            const { data } = error.response || {};
            setData({ nome: "", email: "", cpf: "", cat: "" });
            alert(data?.message || "Erro ao buscar profissional.");
        } finally {
            setIsLoading(false);
        }
    }

    // Registra o voucher
    async function registrarVouche() {
        setLoading(true);
        const dataRequest = {
            nome: data.nome,
            email: data.email,
            cpf: cpfFormatado,
        };
        try {
            const response = await api.post(`/corrida/participantes`, dataRequest);
            setData(response.data); // mantém dados para exibir na tela
            setLoading(false);
            setVoucherEmitido(true); // ativa tela de sucesso
        } catch (error: any) {
            const { data } = error.response || {};
            alert(data?.message || "Erro ao emitir voucher.");
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchParticipants();
    }, []);

    useEffect(() => {
        if (cpf.length === 14) {
            getprofissional();
        }
    }, [cpf]);

    if (!show) return null;

    function refresh() {
        window.location.reload();
    }

    return (
        <div
            className="modal-overlay"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onHide();
                }
            }}
        >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <img src="/banner.png" alt="Banner" className="imagem_banner" />

                <div className='content-info'>
                    {!active ? (
                        availableVouchersCount === 0 ? (
                            <div>
                                <h5>Todos os Vouchers Foram Distribuídos</h5>
                                <p>No momento, não temos mais vouchers disponíveis. Continue nos acompanhando para novidades!</p>
                            </div>
                        ) : (
                            <div>
                                <h5>Voucher de Inscrição da Corrida CREA-RN 2025</h5>
                                <p>Se você faz parte de um dos grupos abaixo, tem direito a um voucher:</p>
                                <ul>
                                    <li>Profissionais Registrados no Sistema Confea/Crea;</li>
                                    <li>Funcionários e Estagiários do CREA-RN;</li>
                                    <li>Funcionários da Mútua.</li>
                                </ul>

                                <h5>Condições de Uso</h5>
                                <ul>
                                    <li>Cada profissional tem direito a um voucher, para uso próprio.</li>
                                    <li>O voucher é exclusivo e poderá ser utilizado apenas uma vez, ficando vinculado ao CPF do beneficiário.</li>
                                    <li>O uso indevido ou fora das condições estabelecidas resultará no cancelamento da inscrição.</li>
                                </ul>

                                <button className="generate-voucher-btn" onClick={() => setActive(true)}>
                                    Quero meu Voucher
                                </button>
                            </div>
                        )
                    ) : (
                        voucherEmitido ? (
                            <>
                                <p>
                                    Os voucher foi emitido e enviado para o seu e-mail <strong>{data?.email}</strong>.
                                </p>
                                <p style={{ marginTop: "1rem" }}>
                                    Para completar sua inscrição, por favor acesse o link abaixo:
                                </p>
                                <p>
                                    <a href="https://www.ticketsports.com.br/e/2-corrida-do-crea-rn-2025-72630" target="_blank" rel="noopener noreferrer">
                                        Acessar página de inscrição
                                    </a>
                                </p>
                                <button
                                    className="generate-voucher-btn"
                                    onClick={refresh}
                                    style={{ marginTop: "1rem" }}
                                >
                                    Fechar
                                </button>
                            </>
                        ) : (
                            <>
                                <strong style={{ fontSize: "0.875rem" }}>INFORME SEU CPF</strong>
                                <input
                                    className="input_cpf"
                                    value={maskCpf(cpf)}
                                    placeholder="CPF"
                                    type="text"
                                    onChange={(e) => setCpf(e.target.value)}
                                />
                                {isloading && <p>Estamos consultando, aguarde...</p>}
                                {data.nome && (
                                    <div style={{ display: "flex", flexDirection: "column", marginTop: "1rem" }}>
                                        <strong>{data?.nome} {data?.cat}  </strong>
                                        <span style={{ fontWeight: 'bold', color: "#4b5563" }}>
                                            Você possui 1 voucher disponível, que será enviado para o e-mail{" "}
                                            <strong style={{ fontSize: "1.2rem" }}>{data?.email}</strong>
                                        </span>
                                        <button className="generate-voucher-btn" onClick={registrarVouche}>
                                            {loading ? "Aguarde..." : "Clique para emitir"}
                                        </button>
                                    </div>
                                )}
                            </>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}