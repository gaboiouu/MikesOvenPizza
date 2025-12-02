import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import About from './pages/About';
import Reservations from './pages/Reservations';
import IncidenciasAdmin from './pages/IncidenciasAdmin';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminProduct from './pages/AdminProduct';
import CarritoCompras from './pages/CarritoCompras';
import Favoritos from './pages/Favoritos';
import MisPedidos from './pages/MisPedidos';
import UserProfile from './pages/UserProfile';
import MisReservas from './pages/MisReservas';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen font-sans text-[#1A1A1A]">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/about" element={<About />} />
            <Route path="/reservas" element={<Reservations />} />
            <Route path="/carrito" element={<CarritoCompras />} />
            <Route path="/favoritos" element={<Favoritos />} />
            <Route path="/mis-pedidos" element={<MisPedidos />} />
            <Route path="/mis-reservas" element={<MisReservas />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<IncidenciasAdmin />} />
            <Route path="/incidencias-admin" element={<ProtectedIncidenciasAdmin />} />
            <Route path="/admin-product" element={<AdminProduct />} />
            <Route path="/profile" element={<UserProfile />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

function ProtectedIncidenciasAdmin() {
  const navigate = useNavigate();
  const rol = localStorage.getItem('rol');

  useEffect(() => {
    if (!rol || (rol !== 'MASTER' && rol !== 'ADMIN')) {
      navigate('/'); 
    }
  }, [rol, navigate]);

  return <IncidenciasAdmin />;
}

export default App;