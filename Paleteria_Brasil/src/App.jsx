import TopBar from './components/TopBar'
import './styles/index.css'
import SideBar from './components/SideBar'
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Vendas from './pages/Vendas';
import Estoque from './pages/Estoque';
import Historico from './pages/Historico';
import Relatorio from './pages/Relatorio';
import Registrar from './pages/Registrar';
import Contatos from './pages/Contatos';
import Validade from './components/Validade';


function App() {


  return (
    <div>
      <Validade/>
      <Router>
        <Routes>
          <Route path='/' element={<Navigate to="/vendas"/>}/>
          <Route path="/vendas" element={<Vendas />} />
          <Route path="/estoque" element={<Estoque />} />
          <Route path="/historico" element={<Historico />} />
          <Route path="/relatorio" element={<Relatorio />} />
          <Route path="/registrar" element={<Registrar />} />
          <Route path="/contatos" element={<Contatos />} />
        </Routes>
      </Router>
    </div>
    
  )
}

export default App
