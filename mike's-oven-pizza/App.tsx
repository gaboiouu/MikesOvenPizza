import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, Navigate, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import About from './pages/About';
import Reservations from './pages/Reservations';
import Login from './pages/Login';
import Register from './pages/Register';
import CarritoCompras from './pages/CarritoCompras';
import Favoritos from './pages/Favoritos';
import MisPedidos from './pages/MisPedidos';
import MisReservas from './pages/MisReservas';
import UserProfile from './pages/UserProfile';
import AdminProduct from './pages/AdminProduct';

import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import IncidenciasAdmin from './admin/IncidenciasAdmin';
import Clientes from './admin/Cliente';
import Productos from './admin/Productos';
import Pedidos from './admin/Pedidos';
import Reportes from './admin/Reportes';
import Reservas from './admin/Reservas';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<PublicLayout />}>
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
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/cuenta" element={<UserProfile />} />
          <Route path="/admin-product" element={<AdminProduct />} />
        </Route>

        <Route path="/admin" element={<ProtectedAdminRoute />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="productos" element={<Productos />} />
          <Route path="pedidos" element={<Pedidos />} />
          <Route path="incidencias" element={<IncidenciasAdmin />} />
          <Route path="reportes" element={<Reportes />} />
          <Route path="reservas" element={<Reservas />} />
        </Route>
      </Routes>
    </Router>
  );
}

function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function ProtectedAdminRoute() {
  const navigate = useNavigate();
  const rol = localStorage.getItem('rol');

  useEffect(() => {
    if (!rol || (rol !== 'MASTER' && rol !== 'ADMIN')) {
      alert('⚠️ No tienes permisos para acceder al panel de administración');
      navigate('/');
    }
  }, [rol, navigate]);

  if (!rol || (rol !== 'MASTER' && rol !== 'ADMIN')) {
    return null;
  }

  return <AdminLayout />;
}

export default App;