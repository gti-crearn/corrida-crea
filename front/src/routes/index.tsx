import { Route, Routes } from "react-router-dom";
import { ListagemParticipantsPage } from "../pages/ListagemParticipantes";
import { Home } from "../pages/home";



export function Router() {
  return (
    <Routes>
        <Route path="/" element={<Home />} />
      <Route path="/listagem_vouchers" element={<ListagemParticipantsPage />} />
     
    </Routes>
  );
}