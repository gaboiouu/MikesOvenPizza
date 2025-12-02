import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, ShoppingCart, Heart, ChevronDown, Menu, X } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../types';

const Navbar: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [favoritosCount, setFavoritosCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
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

    window.addEventListener('scroll', () => {
      setScrolled(window.scrollY > 10);
    });

    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', () => {});
    };
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
    <nav className={`sticky top-0 z-50 bg-white font-sans transition-all duration-300 ${scrolled ? 'shadow-lg' : 'shadow-md'}`}>
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in;
        }

        .animate-pulse-badge {
          animation: pulse 2s ease-in-out infinite;
        }

        .badge {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .badge:hover {
          transform: scale(1.2);
        }

        .nav-link {
          position: relative;
          transition: all 0.3s ease;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 0;
          height: 2px;
          background-color: #D14B4B;
          transition: width 0.3s ease;
        }

        .nav-link:hover::after {
          width: 100%;
        }

        .nav-link.active::after {
          width: 100%;
        }

        .dropdown-menu {
          animation: slideDown 0.2s ease-out;
        }

        .mobile-menu {
          animation: slideDown 0.3s ease-out;
        }

        .mobile-link {
          transition: all 0.2s ease;
        }

        .mobile-link:hover {
          padding-left: 1.5rem;
          background-color: #0D4D45;
          color: white;
        }

        .icon-btn {
          transition: all 0.3s ease;
          position: relative;
        }

        .icon-btn:hover {
          transform: scale(1.15);
        }

        .button-float {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 w-full">

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center cursor-pointer hover:opacity-80 transition-opacity duration-200">
              <div className="flex flex-col items-center justify-center bg-[#0D4D45] text-[#F3E3C2] px-3 sm:px-4 py-1.5 sm:py-2 rounded-b-lg shadow-lg">
                <h1 className="font-bold text-sm sm:text-lg leading-none tracking-wider">MIKE'S</h1>
                <span className="text-xs tracking-[0.1em] text-[#FF8F3A]">PIZZA</span>
              </div>
            </Link>
          </div>

          {/* Links Navegación - Desktop */}
          <div className="hidden lg:flex items-center justify-center gap-6 xl:gap-10 flex-1 mx-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-bold uppercase tracking-wide nav-link transition-colors duration-200 whitespace-nowrap ${
                  isActive(link.path)
                    ? 'text-[#D14B4B] active'
                    : 'text-[#1A1A1A] hover:text-[#D14B4B]'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {user && (user.rol === 'MASTER' || user.rol === 'ADMIN') && (
              <Link
                to="/incidencias-admin"
                className={`text-sm font-bold uppercase tracking-wide nav-link transition-colors duration-200 whitespace-nowrap ${
                  isActive('/incidencias-admin') 
                    ? 'text-[#D14B4B] active' 
                    : 'text-[#1A1A1A] hover:text-[#D14B4B]'
                }`}
              >
                Incidencias
              </Link>
            )}
          </div>

          {/* Iconos y Botones - Desktop */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-6">

            {user && (
              <>
                <Link to="/favoritos" className="relative icon-btn p-2 hover:bg-red-50 rounded-full transition duration-300">
                  <Heart size={20} className="text-[#D14B4B]" />
                  {favoritosCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#D14B4B] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center badge animate-pulse-badge">
                      {favoritosCount}
                    </span>
                  )}
                </Link>

                <Link to="/carrito" className="relative icon-btn p-2 hover:bg-green-50 rounded-full transition duration-300">
                  <ShoppingCart size={20} className="text-[#0D4D45]" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#FF8F3A] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center badge animate-pulse-badge">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {user ? (
              <div className="relative flex items-center">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center gap-2 bg-[#0D4D45] hover:bg-[#08332e] text-white rounded-full px-3 py-1.5 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <span className="w-6 h-6 flex items-center justify-center font-bold text-sm">
                    {getInitial(user.email)}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${showMenu ? "rotate-180" : ""}`}
                  />
                </button>

                {showMenu && (
                  <div className="absolute top-full right-0 mt-2 min-w-[200px] bg-white border border-gray-200 rounded-lg shadow-xl z-50 dropdown-menu overflow-hidden">
                    <Link 
                      to="/mis-pedidos" 
                      className="flex items-center px-4 py-3 gap-2 text-gray-700 hover:bg-[#0D4D45] hover:text-white transition-all duration-200 text-sm" 
                      onClick={() => setShowMenu(false)}
                    >
                      📦 Mis pedidos
                    </Link>
                    <Link 
                      to="/cuenta" 
                      className="flex items-center px-4 py-3 gap-2 text-gray-700 hover:bg-[#0D4D45] hover:text-white transition-all duration-200 text-sm" 
                      onClick={() => setShowMenu(false)}
                    >
                      👤 Mi cuenta
                    </Link>
                    <button 
                      onClick={() => { handleLogout(); setShowMenu(false); }} 
                      className="w-full text-left px-4 py-3 text-[#D14B4B] font-bold hover:bg-[#D14B4B] hover:text-white transition-all duration-200 text-sm"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-2 text-[#1A1A1A] font-bold hover:text-[#D14B4B] uppercase text-sm transition-colors duration-200">
                <User size={18} /> Login
              </Link>
            )}

            <button 
              onClick={handleOrderNow} 
              className="bg-[#D14B4B] hover:bg-red-700 text-white px-6 py-2 rounded-full font-bold uppercase tracking-wider text-sm shadow-lg transition-all duration-300 hover:shadow-xl flex items-center gap-2 button-float whitespace-nowrap"
            >
              <ShoppingBag size={18} /> Pedir
            </button>
          </div>

          {/* Botón Menú Mobile */}
          <div className="lg:hidden flex items-center gap-3">
            {user && (
              <>
                <Link to="/favoritos" className="relative icon-btn p-2">
                  <Heart size={20} className="text-[#D14B4B]" />
                  {favoritosCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#D14B4B] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {favoritosCount}
                    </span>
                  )}
                </Link>

                <Link to="/carrito" className="relative icon-btn p-2">
                  <ShoppingCart size={20} className="text-[#0D4D45]" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#FF8F3A] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            <button 
              onClick={() => setMobileMenu(!mobileMenu)}
              className="p-2 hover:bg-gray-100 rounded transition-colors duration-200"
            >
              {mobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú Mobile */}
      {mobileMenu && (
        <div className="lg:hidden bg-white w-full border-t border-gray-200 mobile-menu">
          <ul className="flex flex-col space-y-1 p-4">

            {navLinks.map((link) => (
              <li key={link.path}>
                <Link 
                  to={link.path} 
                  className="block px-4 py-3 font-bold text-[#1A1A1A] hover:bg-[#0D4D45] hover:text-white rounded-lg mobile-link"
                  onClick={() => setMobileMenu(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}

            {user && (user.rol === 'MASTER' || user.rol === 'ADMIN') && (
              <li>
                <Link 
                  to="/incidencias-admin" 
                  className="block px-4 py-3 font-bold text-[#1A1A1A] hover:bg-[#0D4D45] hover:text-white rounded-lg mobile-link"
                  onClick={() => setMobileMenu(false)}
                >
                  Incidencias Admin
                </Link>
              </li>
            )}

            <li className="border-t border-gray-200 pt-2 mt-2">
              {user && (
                <>
                  <Link 
                    to="/mis-pedidos" 
                    className="block px-4 py-3 font-bold text-[#1A1A1A] hover:bg-[#0D4D45] hover:text-white rounded-lg mobile-link"
                    onClick={() => setMobileMenu(false)}
                  >
                    📦 Mis pedidos
                  </Link>
                  <Link 
                    to="/cuenta" 
                    className="block px-4 py-3 font-bold text-[#1A1A1A] hover:bg-[#0D4D45] hover:text-white rounded-lg mobile-link"
                    onClick={() => setMobileMenu(false)}
                  >
                    👤 Mi cuenta
                  </Link>
                  <button 
                    onClick={() => { handleLogout(); setMobileMenu(false); }} 
                    className="w-full text-left px-4 py-3 font-bold text-[#D14B4B] hover:bg-[#D14B4B] hover:text-white rounded-lg mobile-link"
                  >
                    Cerrar sesión
                  </button>
                </>
              )}

              {!user && (
                <Link 
                  to="/login" 
                  className="block px-4 py-3 font-bold text-[#1A1A1A] hover:bg-[#0D4D45] hover:text-white rounded-lg mobile-link"
                  onClick={() => setMobileMenu(false)}
                >
                  Iniciar Sesión
                </Link>
              )}
            </li>

            <li className="border-t border-gray-200 pt-2 mt-2">
              <button 
                onClick={() => { handleOrderNow(); setMobileMenu(false); }}
                className="w-full bg-[#D14B4B] hover:bg-red-700 text-white px-4 py-3 rounded-lg font-bold uppercase tracking-wider text-sm shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
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
