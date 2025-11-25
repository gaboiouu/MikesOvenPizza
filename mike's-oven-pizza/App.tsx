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
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<IncidenciasAdmin />} />
            <Route path="/incidencias-admin" element={<ProtectedIncidenciasAdmin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

function ProtectedIncidenciasAdmin() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    if (!user || (user.rol !== 'MASTER' && user.rol !== 'ADMIN')) {
      navigate('/'); 
    }
  }, [user, navigate]);

  return <IncidenciasAdmin />;
}

export default App;