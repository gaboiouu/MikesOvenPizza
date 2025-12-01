import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, ShoppingCart, Heart, ChevronDown, Menu, X } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../types';

const Navbar: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [favoritosCount, setFavoritosCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(cart.length);
    };
    const updateFavoritosCount = () => {
      const favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
      setFavoritosCount(favoritos.length);
    };
    updateCartCount();
    updateFavoritosCount();

    const interval = setInterval(() => {
      updateCartCount();
      updateFavoritosCount();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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

          <div className="hidden md:flex flex-1 justify-center items-center space-x-8">
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

          <div className="hidden md:flex items-center gap-4">

            {user && (
              <>
                <Link to="/favoritos" className="relative p-2 hover:bg-gray-100 rounded-full transition">
                  <Heart size={24} className="text-[#D14B4B]" />
                  {favoritosCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#D14B4B] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {favoritosCount}
                    </span>
                  )}
                </Link>

                <Link to="/carrito" className="relative p-2 hover:bg-gray-100 rounded-full transition">
                  <ShoppingCart size={24} className="text-[#0D4D45]" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#FF8F3A] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {user ? (
              <div className="relative flex items-center gap-2">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center gap-2 bg-[#0D4D45] text-white rounded-full px-3 py-1"
                >
                  <span className="w-8 h-8 flex items-center justify-center font-bold text-lg">
                    {getInitial(user.email)}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-200 ${showMenu ? "rotate-180" : ""}`}
                  />
                </button>

                {showMenu && (
                  <div className="absolute top-full right-0 mt-2 min-w-[200px] bg-white border rounded shadow-lg z-50">
                    <Link to="/mis-pedidos" className="flex items-center px-4 py-3 gap-2 hover:bg-[#0D4D45] hover:text-white" onClick={() => setShowMenu(false)}>📦 Mis pedidos</Link>
                    <Link to="/cuenta" className="flex items-center px-4 py-3 gap-2 hover:bg-[#0D4D45] hover:text-white" onClick={() => setShowMenu(false)}>👤 Información personal</Link>
                    <button onClick={() => { handleLogout(); setShowMenu(false); }} className="w-full text-left px-4 py-3 text-[#D14B4B] font-bold hover:bg-[#0D4D45] hover:text-white">Cerrar sesión</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-2 text-[#1A1A1A] font-bold hover:text-[#D14B4B] uppercase text-sm">
                <User size={18} /> Iniciar Sesión
              </Link>
            )}

            <button onClick={handleOrderNow} className="bg-[#D14B4B] hover:bg-red-700 text-white px-6 py-2 rounded-full font-bold uppercase tracking-wider shadow-lg flex items-center gap-2 hover:scale-105 transition">
              <ShoppingBag size={18} /> Pedir Ahora
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setMobileMenu(!mobileMenu)}>
              {mobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenu && (
        <div className="md:hidden bg-white w-full shadow-md">
          <ul className="flex flex-col space-y-2 p-4">

            {navLinks.map((link) => (
              <li key={link.path}>
                <Link to={link.path} className="block px-4 py-2 font-bold text-[#1A1A1A] hover:bg-[#0D4D45] hover:text-white rounded" onClick={() => setMobileMenu(false)}>
                  {link.name}
                </Link>
              </li>
            ))}

            {user && (user.rol === 'MASTER' || user.rol === 'ADMIN') && (
              <li>
                <Link to="/incidencias-admin" className="block px-4 py-2 font-bold text-[#1A1A1A] hover:bg-[#0D4D45] hover:text-white rounded" onClick={() => setMobileMenu(false)}>
                  Incidencias Admin
                </Link>
              </li>
            )}

            {user && (
              <>
                <li>
                  <Link to="/favoritos" className="flex items-center gap-2 px-4 py-2 font-bold text-[#1A1A1A] hover:bg-[#0D4D45] hover:text-white rounded">
                    <Heart size={20} className="text-[#D14B4B]" /> Favoritos ({favoritosCount})
                  </Link>
                </li>
                <li>
                  <Link to="/carrito" className="flex items-center gap-2 px-4 py-2 font-bold text-[#1A1A1A] hover:bg-[#0D4D45] hover:text-white rounded">
                    <ShoppingCart size={20} className="text-[#0D4D45]" /> Carrito ({cartCount})
                  </Link>
                </li>
                <li>
                  <Link to="/mis-pedidos" className="block px-4 py-2 font-bold text-[#1A1A1A] hover:bg-[#0D4D45] hover:text-white rounded" onClick={() => setMobileMenu(false)}>📦 Mis pedidos</Link>
                </li>
                <li>
                  <Link to="/cuenta" className="block px-4 py-2 font-bold text-[#1A1A1A] hover:bg-[#0D4D45] hover:text-white rounded" onClick={() => setMobileMenu(false)}>👤 Información personal</Link>
                </li>
                <li>
                  <button onClick={() => { handleLogout(); setMobileMenu(false); }} className="w-full text-left px-4 py-2 font-bold text-[#D14B4B] hover:bg-[#0D4D45] hover:text-white rounded">Cerrar sesión</button>
                </li>
              </>
            )}

            {!user && (
              <li>
                <Link to="/login" className="block px-4 py-2 font-bold text-[#1A1A1A] hover:bg-[#0D4D45] hover:text-white rounded">Iniciar Sesión</Link>
              </li>
            )}

            <li>
              <button onClick={handleOrderNow} className="w-full bg-[#D14B4B] hover:bg-red-700 text-white px-4 py-2 rounded-full font-bold uppercase tracking-wider shadow-lg flex items-center gap-2">
                <ShoppingBag size={18} /> Pedir Ahora
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
