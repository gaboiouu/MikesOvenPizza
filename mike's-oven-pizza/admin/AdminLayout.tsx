import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingBag, 
  AlertCircle, 
  BarChart3, 
  LogOut,
  Menu,
  X,
  ChevronLeft
} from 'lucide-react';

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const nombreCompleto = localStorage.getItem('nombreCompleto') || 'Admin';
  const rol = localStorage.getItem('rol') || 'ADMIN';

  useEffect(() => {
    const userRole = localStorage.getItem('rol');
    if (userRole !== 'ADMIN' && userRole !== 'MASTER') {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Clientes', path: '/admin/clientes' },
    { icon: Package, label: 'Productos', path: '/admin/productos' },
    { icon: ShoppingBag, label: 'Pedidos', path: '/admin/pedidos' },
    { icon: AlertCircle, label: 'Incidencias', path: '/admin/incidencias' },
    { icon: BarChart3, label: 'Reportes', path: '/admin/reportes' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#1a2332] text-white transition-all duration-300 hidden lg:flex flex-col`}>
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div>
                <h1 className="text-xl font-bold text-[#FF8F3A]">MIKE'S PIZZA</h1>
                <p className="text-xs text-gray-400">Panel Administrador</p>
              </div>
            )}
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-700 rounded-lg transition"
            >
              <ChevronLeft className={`transition-transform ${!sidebarOpen && 'rotate-180'}`} size={20} />
            </button>
          </div>
        </div>

        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#D14B4B] rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
              {nombreCompleto.charAt(0).toUpperCase()}
            </div>
            {sidebarOpen && (
              <div className="overflow-hidden">
                <p className="font-semibold truncate">{nombreCompleto}</p>
                <p className="text-xs text-[#FF8F3A]">{rol}</p>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                  isActive(item.path)
                    ? 'bg-[#D14B4B] text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Icon size={20} className="flex-shrink-0" />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-3 text-red-400 hover:bg-red-500/10 rounded-lg transition"
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="font-medium">Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed top-0 left-0 w-64 h-full bg-[#1a2332] text-white z-50 lg:hidden flex flex-col">
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-[#FF8F3A]">MIKE'S PIZZA</h1>
                <p className="text-xs text-gray-400">Panel</p>
              </div>
              <button onClick={() => setMobileOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#D14B4B] rounded-full flex items-center justify-center font-bold">
                  {nombreCompleto.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold">{nombreCompleto}</p>
                  <p className="text-xs text-[#FF8F3A]">{rol}</p>
                </div>
              </div>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 p-3 rounded-lg transition ${
                      isActive(item.path)
                        ? 'bg-[#D14B4B] text-white'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-gray-700">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full p-3 text-red-400 hover:bg-red-500/10 rounded-lg"
              >
                <LogOut size={20} />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </aside>
        </>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm p-4 flex items-center justify-between lg:justify-end">
          <button 
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={24} />
          </button>
          
          <div className="flex items-center gap-4">
            <Link 
              to="/"
              className="px-4 py-2 bg-[#0D4D45] text-white rounded-lg hover:bg-[#074036] transition font-medium"
            >
              Ver Sitio Web
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;