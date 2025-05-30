import { useEffect, useState } from 'react';

import Modal from 'react-bootstrap/Modal';
import { api } from '../../services/api';
import { maskCpf } from '../../utils/mask_cpf';
import { ComponenteModalAlert } from './modaInfo';
import { Tag } from '@phosphor-icons/react';




interface Participante {
    nome: string,
    email: string,
    cpf: string
    cat?: string
}

export function ComponenteModal(props: any) {
    const [active, setActive] = useState(false)
    const [cpf, setCpf] = useState("")
    const [data, setData] = useState<Participante>({} as Participante)
    const [loading, setLoading] = useState(false)
    const [isloading, setIsLoading] = useState(false)
    const [message, setMessage] = useState("")
    const cpfFormatado = cpf.replace(/[.-]/g, '')

    const [modalShow, setModalShow] = useState(false);

    const [availableVouchersCount, setAvailableVouchersCount] = useState<number>(0);
    async function getprofissional() {
        setIsLoading(true)
        setTimeout(() => {
            api.get(`/profissional/${cpfFormatado}`)
                .then((response) => {
                    setData(response.data)
                    console.log(response.data)
                    setIsLoading(false)
                })
                .catch((error) => {
                    console.log(error)
                    const { data } = error.response
                    setData({
                        nome: "",
                        email: "",
                        cpf: "",
                        cat: ""
                    } as Participante)
                    alert(data.message)
                    setIsLoading(false)
                })
        }, 2000)
    }

    const fetchParticipants = async () => {
        try {
            setLoading(true);
            const response = await api.get(
                `corrida/participantes_list`,
                {
                    params: { codigo: "Crea@2024" },
                }
            );

            setAvailableVouchersCount(response.data.quantidadeVouchersDisponiveis);

        } catch (err) {
            console.log('Erro ao carregar os dados dos participantes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchParticipants()
    }, [])

    async function registrarVouche() {
        setLoading(true)
        const dataRequest = {
            nome: data.nome,
            email: data.email,
            cpf: cpfFormatado
        }
        setTimeout(() => {
            api.post(`/corrida/participantes`, dataRequest)
                .then((response) => {
                    setData(response.data)
                    props.onHide()
                    setModalShow(true)
                    setLoading(false)
                    setCpf("")
                    setMessage("")

                })
                .catch((error) => {
                    const { data } = error.response
                    alert(data.message)
                    setLoading(false)

                })
        }, 1000)
    }


    useEffect(() => {
        if (cpf.length === 14) {
            getprofissional()
        }
    }, [cpf])
    return (
        <div >
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                backdrop="static"
            >
                <Modal.Body style={{ background: "oklch(96.7% 0.003 264.542)", padding: "0", }}>
                    <img src="/banner.png" alt="" className='imagem_banner' />
                    {active ? (
                        <div style={{ padding: "1rem" }}>
                            <div className='content_search'>
                                <strong style={{ fontSize: "0.875rem" }}>INFORME SEU CPF</strong>
                                <input className='input_cpf' value={maskCpf(cpf)} placeholder='CPF' type="text" onChange={(e) => setCpf(e.target.value)} />
                            </div>
                            {isloading && "Estamos consultando, aguarde..."}
                            {message ? message : (
                                <div style={{ padding: "0.5rem 0" }}>
                                    <strong style={{ marginTop: "2rem", fontWeight: 'bold', color: "#4b5563" }}>{data.nome}   </strong> <span style={{ fontSize: "0.85rem" }}>{data.cat?.toUpperCase()}</span>
                                </div>
                            )}
                            {data.nome && (
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <span style={{ fontWeight: 'bold', color: "#4b5563" }}>Você possui 1 voucher disponível, que será enviado para o e-mail  <strong style={{ fontSize: "1.2rem" }}>{data?.email}</strong>  </span>
                                    <button className='generate-voucher-btn' onClick={registrarVouche}>{
                                        loading ? "Aguarde..." : "Clique para emitir"
                                    } </button>

                                </div>
                            )}
                        </div>

                    ) : (
                        <div style={{ padding: "1rem" }}>
                            {availableVouchersCount === 0 ? (
                                <>
                                    <strong>Todos os Vouchers Foram Distribuídos</strong>
                                    <p>
                                        No momento, não temos mais vouchers disponíveis. Continue nos acompanhando para novidades!</p>
                                </>
                            ) : (
                                <div>
                                    <h5>Voucher de Inscrição da Corrida CREA-RN 2025 </h5>
                                    <div>
                                        Se você faz parte de um dos grupos abaixo, tem direito a um voucher de inscrição do primeiro lote exclusivo da Corrida CREA-RN.
                                        <ul style={{ marginTop: "1rem" }}>
                                            <li> Profissionais Registrados no Sistema Confea/Crea;</li>
                                            <li> Funcionários e Estagiários do CREA-RN;</li>
                                            <li> Funcionários da Mútua.</li>
                                        </ul>
                                        <h5>Condições de Uso</h5>

                                        <ul style={{ marginTop: "1rem" }}>
                                            <li>Cada profissional tem direito a um voucher, para uso próprio.</li>
                                            <li> O voucher é exclusivo e poderá ser utilizado apenas uma vez, ficando vinculado ao CPF do beneficiário.</li>
                                            <li> O uso indevido ou fora das condições estabelecidas resultará no cancelamento da inscrição.</li>
                                        </ul>
                                        Clique no botão abaixo para consultar e gerar os seu voucher.

                                    </div>
                                    <button className='generate-voucher-btn' onClick={() => setActive(true)}> <Tag size={25} /> Quero meu Voucher</button>
                                </div>
                            )}
                        </div>

                    )}

                </Modal.Body>

            </Modal>
            <ComponenteModalAlert show={modalShow} data={data} onHide={() => setModalShow(false)} />
        </div>
    );
}
