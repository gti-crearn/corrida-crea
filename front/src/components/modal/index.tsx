import { useEffect, useState } from 'react';

import Modal from 'react-bootstrap/Modal';
import { api } from '../../services/api';
import { maskCpf } from '../../utils/mask_cpf';




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
    // const []

    async function getProfissional() {
        setIsLoading(true);
    
        try {
            const response = await api.get(`/profissional/${cpfFormatado}`);
            setData(response.data);
            console.log(response.data);
        } catch (error:any) {
            // Verifique se error.response existe antes de desestruturar
            if (error.response && error.response.data) {
                setMessage(error.response.data.message);
            } else {
                setMessage('Ocorreu um erro inesperado. Tente novamente mais tarde.');
            }
        } finally {
            // Garantir que setIsLoading seja falso no fim do processo
            setIsLoading(false);
        }
    }

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
                    alert(`Vouches emitidos, e enviado para o E-mail ${data.email}`)
                    setLoading(false)
                    setCpf("")
                    setMessage("")
                    setData(
                        {
                            nome: "",
                            email: "",
                            cpf: "",
                            cat: ""
                        }
                    )
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
            getProfissional()
        }
    }, [cpf])
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                {/* <div>
                    <h5> CORRIDA CREA-RN</h5>
                    {active && <p>Informe CPF para consultar a disponibilidade dos seus vouchers</p>}
                </div> */}

            </Modal.Header>
            <Modal.Body>
                <img src="/banner.png" alt="" className='imagem_banner' />
                {active ? (
                    <>

                        <div className='content_search'>
                            <strong>Informe seu CPF</strong>
                            <input className='input_cpf' value={maskCpf(cpf)} placeholder='CPF' type="text" onChange={(e) => setCpf(e.target.value)} />

                        </div>
                        {isloading && "Estamos consultando, aguarde..."}
                        {message ? message : (<p style={{ marginTop: "1rem", fontWeight: 'bold', color: "#4b5563" }}>{data.nome}  {data.cat?.toUpperCase()} </p>)}

                        {data.nome && (
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <img src="/voucher.webp" width={80} alt="" />
                                <span style={{ fontWeight: 'bold', color: "#4b5563" }}>Você possie 2 Vouchers disponivel,  </span>
                                <button className='generate-voucher-btn' onClick={registrarVouche}>{
                                    loading ? "Aguarde..." : "Clique para emitir"
                                } </button>

                            </div>
                        )}
                    </>

                ) : (
                    <div>
                        <h5>Voucher de 50% de Desconto na Inscrição da Corrida CREA-RN </h5>
                        <div>
                            Se você faz parte de um dos grupos abaixo, tem direito a dois vouchers de 50% de desconto na inscrição da Corrida CREA-RN : um para você e outro para um convidado.
                            <ul style={{ marginTop: "1rem" }}>
                                <li> Profissionais Registrados no Sistema Confea/Crea;</li>
                                <li> Funcionários e Estagiários do CREA-RN;</li>
                                <li> Funcionários da Mútua.</li>
                            </ul>
                            <h5>Condições de Uso</h5>

                            <ul style={{ marginTop: "1rem" }}>
                                <li>Cada pessoa tem direito a dois vouchers : um para uso próprio e outro para um convidado.</li>
                                <li> O voucher é exclusivo e poderá ser utilizado apenas uma vez, ficando vinculado ao CPF do beneficiário.</li>
                                <li> O uso indevido ou fora das condições estabelecidas resultará no cancelamento do desconto.</li>
                            </ul>
                            Clique no botão abaixo para consultar e gerar os seus vouchers.

                        </div>
                        <button className='generate-voucher-btn' onClick={() => setActive(true)}>Quero meu Vouche</button>
                    </div>
                )}

            </Modal.Body>

        </Modal>
    );
}
