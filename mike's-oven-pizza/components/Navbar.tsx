import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, User } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../types';

const Navbar: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Menú', path: '/menu' },
    { name: 'Sobre Nosotros', path: '/about' },
    { name: 'Reservas', path: '/reservas' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleOrderNow = () => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Hola%20Mike's%20Pizza,%20quiero%20hacer%20un%20pedido`, '_blank');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload();
  };

  const getInitial = (email: string) => email ? email.charAt(0).toUpperCase() : '';

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 w-full">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center cursor-pointer">
              <div className="flex flex-col items-center justify-center bg-[#0D4D45] text-[#F3E3C2] px-4 py-2 rounded-b-lg shadow-lg">
                <h1 className="font-bold text-xl leading-none tracking-wider">MIKE'S</h1>
                <span className="text-xs tracking-[0.2em] text-[#FF8F3A]">OVEN PIZZA</span>
              </div>
            </Link>
          </div>
          <div className="flex-1 flex justify-center items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-bold uppercase tracking-wide transition-colors duration-200 ${
                  isActive(link.path) 
                    ? 'text-[#D14B4B] border-b-2 border-[#D14B4B]' 
                    : 'text-[#1A1A1A] hover:text-[#D14B4B]'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {user && (user.rol === 'MASTER' || user.rol === 'ADMIN') && (
              <Link
                to="/incidencias-admin"
                className={`text-sm font-bold uppercase tracking-wide transition-colors duration-200 ${
                  isActive('/incidencias-admin') 
                    ? 'text-[#D14B4B] border-b-2 border-[#D14B4B]' 
                    : 'text-[#1A1A1A] hover:text-[#D14B4B]'
                }`}
              >
                Incidencias Admin
              </Link>
            )}
          </div>
          <div className="flex items-center gap-6">
            {user ? (
              <div className="relative flex items-center gap-2">
                <button
                  className="flex items-center bg-[#0D4D45] rounded-full px-1 py-1"
                  onClick={() => setShowMenu(!showMenu)}
                  style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                >
                  <span className="w-8 h-8 flex items-center justify-center font-bold text-lg text-white">
                    {getInitial(user.email)}
                  </span>
                  <span className="ml-2 flex items-center">
                    {showMenu ? (
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M6 15l6-6 6 6"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M6 9l6 6 6-6"/>
                      </svg>
                    )}
                  </span>
                </button>
                {showMenu && (
                  <div className="absolute top-full right-0 mt-2 min-w-[200px] bg-white border rounded shadow-lg z-50 overflow-hidden">
                    <Link
                      to="/pedidos"
                      className="flex items-center px-4 py-3 gap-2 hover:bg-[#0D4D45] hover:text-white transition-colors"
                      onClick={() => setShowMenu(false)}
                    >
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2" viewBox="0 0 24 24">
                        <path d="M3 6h18M3 6v12a2 2 0 002 2h14a2 2 0 002-2V6M16 10v6M8 10v6"/>
                      </svg>
                      Mis pedidos
                    </Link>
                    <Link
                      to="/favoritos"
                      className="flex items-center px-4 py-3 gap-2 hover:bg-[#0D4D45] hover:text-white transition-colors"
                      onClick={() => setShowMenu(false)}
                    >
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                      Favoritos
                    </Link>
                    <Link
                      to="/cuenta"
                      className="flex items-center px-4 py-3 gap-2 hover:bg-[#0D4D45] hover:text-white transition-colors"
                      onClick={() => setShowMenu(false)}
                    >
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2" viewBox="0 0 24 24">
                        <circle cx="12" cy="7" r="4"/>
                        <path d="M5.5 21a8.38 8.38 0 0113 0"/>
                      </svg>
                      Información personal
                    </Link>
                    <button
                      onClick={() => { handleLogout(); setShowMenu(false); }}
                      className="w-full text-left px-4 py-3 text-[#D14B4B] font-bold hover:bg-[#0D4D45] hover:text-white transition-colors"
                    >
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2 inline" viewBox="0 0 24 24">
                        <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"/>
                      </svg>
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/login"
                className="flex items-center gap-2 text-[#1A1A1A] font-bold hover:text-[#D14B4B] transition-colors uppercase text-sm"
              >
                <User size={18} /> Iniciar Sesión
              </Link>
            )}
            <button 
              onClick={handleOrderNow}
              className="bg-[#D14B4B] hover:bg-red-700 text-white px-6 py-2 rounded-l-full rounded-r-full font-bold uppercase tracking-wider shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
            >
              <ShoppingBag size={18} />
              Pedir Ahora
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;