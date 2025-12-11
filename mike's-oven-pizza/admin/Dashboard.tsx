import React, { useEffect, useState } from 'react';
import { DollarSign, Users, ShoppingBag, TrendingUp, Package, AlertCircle, Calendar, CalendarDays, RefreshCw } from 'lucide-react';

interface Stats {
  totalVentas: number;
  totalClientes: number;
  totalPedidos: number;
  totalProductos: number;
  pedidosPendientes: number;
  incidenciasPendientes: number;
  incidenciasCerradas: number; 
  totalIncidencias: number; 
  reservasPendientes: number;
  ventasDelDia: number;
  pedidosDelDia: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalVentas: 0,
    totalClientes: 0,
    totalPedidos: 0,
    totalProductos: 0,
    pedidosPendientes: 0,
    incidenciasPendientes: 0,
    incidenciasCerradas: 0, 
    totalIncidencias: 0, 
    reservasPendientes: 0,
    ventasDelDia: 0,
    pedidosDelDia: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('❌ No hay token');
      setError('No hay sesión activa');
      setLoading(false);
      return;
    }
    
    try {
      console.log('📊 Cargando estadísticas del dashboard...');
      
      const [pedidosRes, usuariosRes, productosRes, incidenciasRes, reservasRes] = await Promise.all([
        fetch('http://localhost:8080/pedidos/listar', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch('http://localhost:8080/users', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch('http://localhost:8080/productos/listar', {
          headers: { 'Content-Type': 'application/json' }
        }),
        fetch('http://localhost:8080/incidencias-admin/listar', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch('http://localhost:8080/reservas/listar-paginado?page=0&size=1000', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      ]);

      if (!pedidosRes.ok) throw new Error('Error al cargar pedidos');
      if (!usuariosRes.ok) throw new Error('Error al cargar usuarios');
      if (!productosRes.ok) throw new Error('Error al cargar productos');
      if (!incidenciasRes.ok) throw new Error('Error al cargar incidencias');
      if (!reservasRes.ok) throw new Error('Error al cargar reservas');

      const pedidos = await pedidosRes.json();
      const usuarios = await usuariosRes.json();
      const productos = await productosRes.json();
      const incidencias = await incidenciasRes.json();
      const reservasData = await reservasRes.json();
      
      const reservas = reservasData.content || reservasData;

      console.log('📦 Pedidos cargados:', pedidos.length);

      const pedidosDelDiaFiltrados = Array.isArray(pedidos)
        ? pedidos.filter((p: any) => {
            try {
              const fechaPedido = p.fechaPedido;
              
              if (!fechaPedido) return false;
              
              const fechaLocal = fechaPedido.split('T')[0];
              
              const match = fechaLocal === fechaSeleccionada;
              
              if (match) {
                console.log('✅ Pedido del día:', p.pedidoId, fechaLocal, 'S/', p.total);
              }
              
              return match;
            } catch (error) {
              console.error('❌ Error procesando pedido:', error);
              return false;
            }
          })
        : [];

      const ventasDelDia = pedidosDelDiaFiltrados.reduce(
        (sum: number, p: any) => sum + (parseFloat(p.total) || 0), 
        0
      );

      console.log(`📅 Pedidos del ${fechaSeleccionada}: ${pedidosDelDiaFiltrados.length}`);
      console.log(`💰 Ventas del día: S/ ${ventasDelDia.toFixed(2)}`);

      const totalVentas = Array.isArray(pedidos) 
        ? pedidos.reduce((sum: number, p: any) => sum + (parseFloat(p.total) || 0), 0) 
        : 0;
      
      const pedidosPendientes = Array.isArray(pedidos)
        ? pedidos.filter((p: any) => p.estado === 'PENDIENTE').length
        : 0;
      
      const totalIncidencias = Array.isArray(incidencias) ? incidencias.length : 0;
      
      const incidenciasPendientes = Array.isArray(incidencias)
        ? incidencias.filter((i: any) => 
            i.estado === 'ABIERTO' || i.estado === 'EN_PROCESO'
          ).length
        : 0;
      
      const incidenciasCerradas = Array.isArray(incidencias)
        ? incidencias.filter((i: any) => i.estado === 'CERRADO').length
        : 0;

      const reservasPendientes = Array.isArray(reservas)
        ? reservas.filter((r: any) => 
            r.estado === 'PENDIENTE' || r.estado === 'CONFIRMADO'
          ).length
        : 0;

      const newStats = {
        totalVentas,
        totalClientes: Array.isArray(usuarios) ? usuarios.length : 0,
        totalPedidos: Array.isArray(pedidos) ? pedidos.length : 0,
        totalProductos: Array.isArray(productos) ? productos.length : 0,
        pedidosPendientes,
        totalIncidencias,
        incidenciasPendientes,
        incidenciasCerradas,
        reservasPendientes,
        ventasDelDia,
        pedidosDelDia: pedidosDelDiaFiltrados.length
      };

      console.log('✅ Stats actualizados:', { ventasDelDia, pedidosDelDia: pedidosDelDiaFiltrados.length });
      setStats(newStats);
      
      setLoading(false);
      setRefreshing(false);
    } catch (error: any) {
      console.error('❌ Error al cargar estadísticas:', error);
      setError(error.message || 'Error al cargar estadísticas');
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [fechaSeleccionada]);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log('🔄 Auto-actualizando dashboard...');
      fetchStats();
    }, 30000);

    return () => clearInterval(interval);
  }, [fechaSeleccionada]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  const cards = [
    {
      title: 'Ventas Totales',
      value: `S/ ${(stats.totalVentas || 0).toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-blue-500',
      bgLight: 'bg-blue-50'
    },
    {
      title: 'Total Clientes',
      value: stats.totalClientes || 0,
      icon: Users,
      color: 'bg-green-500',
      bgLight: 'bg-green-50'
    },
    {
      title: 'Total Pedidos',
      value: stats.totalPedidos || 0,
      icon: ShoppingBag,
      color: 'bg-purple-500',
      bgLight: 'bg-purple-50'
    },
    {
      title: 'Productos',
      value: stats.totalProductos || 0,
      icon: Package,
      color: 'bg-orange-500',
      bgLight: 'bg-orange-50'
    },
    {
      title: 'Pedidos Pendientes',
      value: stats.pedidosPendientes || 0,
      icon: TrendingUp,
      color: 'bg-yellow-500',
      bgLight: 'bg-yellow-50'
    },
    {
      title: 'Incidencias Abiertas',
      value: stats.incidenciasPendientes || 0,
      icon: AlertCircle,
      color: 'bg-red-500',
      bgLight: 'bg-red-50'
    },
    {
      title: 'Reservas Activas',
      value: stats.reservasPendientes || 0,
      icon: Calendar,
      color: 'bg-indigo-500',
      bgLight: 'bg-indigo-50'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#D14B4B]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-red-800 text-lg font-bold mb-2">Error al cargar dashboard</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600">Análisis y estadísticas de Mike's Pizza</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="bg-[#0D4D45] text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-[#0a3d37] transition-colors disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
          <span className="hidden sm:inline">Actualizar</span>
        </button>
      </div>

      <div className="mb-6 bg-gradient-to-r from-[#D14B4B] to-[#FF8F3A] rounded-xl shadow-xl p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <CalendarDays size={28} className="sm:w-8 sm:h-8" />
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Ventas del Día</h2>
              <p className="text-xs sm:text-sm opacity-90">Filtra por fecha específica</p>
            </div>
          </div>
          <input
            type="date"
            value={fechaSeleccionada}
            onChange={(e) => setFechaSeleccionada(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="w-full sm:w-auto px-3 sm:px-4 py-2 rounded-lg text-gray-800 text-sm sm:text-base font-medium focus:ring-2 focus:ring-white"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4">
            <p className="text-xs sm:text-sm opacity-90 mb-1">Total Vendido</p>
            <p className="text-2xl sm:text-4xl font-bold">S/ {stats.ventasDelDia.toFixed(2)}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4">
            <p className="text-xs sm:text-sm opacity-90 mb-1">Pedidos Realizados</p>
            <p className="text-2xl sm:text-4xl font-bold">{stats.pedidosDelDia}</p>
          </div>
        </div>
        {stats.pedidosDelDia > 0 && (
          <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <p className="text-xs sm:text-sm opacity-90">Ticket Promedio:</p>
            <p className="text-xl sm:text-2xl font-bold">
              S/ {(stats.ventasDelDia / stats.pedidosDelDia).toFixed(2)}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className={`${card.bgLight} p-2 sm:p-3 rounded-lg`}>
                  <Icon className={`${card.color.replace('bg-', 'text-')} w-5 h-5 sm:w-6 sm:h-6`} />
                </div>
              </div>
              <h3 className="text-gray-500 text-xs sm:text-sm font-medium mb-1">{card.title}</h3>
              <p className="text-2xl sm:text-3xl font-bold text-gray-800">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 sm:mt-8 bg-white rounded-xl shadow-md p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Resumen del Sistema</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b text-sm sm:text-base">
            <span className="text-gray-600">Promedio por pedido:</span>
            <span className="font-bold text-[#D14B4B]">
              S/ {stats.totalPedidos > 0 ? ((stats.totalVentas || 0) / stats.totalPedidos).toFixed(2) : '0.00'}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b text-sm sm:text-base">
            <span className="text-gray-600">Pedidos completados:</span>
            <span className="font-bold text-green-600">
              {(stats.totalPedidos || 0) - (stats.pedidosPendientes || 0)}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b text-sm sm:text-base">
            <span className="text-gray-600">Incidencias cerradas:</span>
            <span className="font-bold text-blue-600">
              {stats.incidenciasCerradas} de {stats.totalIncidencias}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 text-sm sm:text-base">
            <span className="text-gray-600">Tasa de conversión:</span>
            <span className="font-bold text-blue-600">
              {stats.totalClientes > 0 ? (((stats.totalPedidos || 0) / stats.totalClientes) * 100).toFixed(1) : '0'}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;