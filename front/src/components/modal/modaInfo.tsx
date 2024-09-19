import Modal from 'react-bootstrap/Modal';

export function ComponenteModalAlert(props: any) {
  
    const {data} = props
    function refresh (){
        window.location.reload();
    }
    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
 
            <Modal.Body>    
            <p >Os vouchers foram emitidos e enviados para o e-mail <strong>{data?.participante?.email}</strong>, por favor acesse o link baixo e utilize os vouchers para completar sua inscrição.    <a href="https://site.ticketsports.com.br/Inscricao/categoria.aspx?__idEvento=69667&origem=ticketsports&lang=pt-BR" target='_blank'> Inscreva-se</a>  </p>
           <div style={{width:"100%", display:"flex", justifyContent:"center"}}>
           <button style={{background:"green", border:"0", padding:"5px 10px",color:"white", borderRadius:"4px"}} onClick={refresh} >OK </button>
           </div>

            </Modal.Body>

        </Modal>
    );
}
