import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react'
import './App.css'
import { ComponenteModal } from './components/modal';


function App() {
  const [modalShow, setModalShow] = useState(true);
  return (
    <div style={ {width:"100vh",  display:"flex", justifyContent:"center", marginTop:"2rem"}}>
      <ComponenteModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </div>


  )
}

export default App
