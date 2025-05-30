import { useState } from "react";
import { ComponenteModal } from "../../components/modalConsulta";



export function Home() {
    const [modalShow, setModalShow] = useState(true);
    return (     
        <div className="back" >
        <ComponenteModal
          show={modalShow}
          onHide={() => setModalShow(false)}
        />
      </div>
    )
  }
  
