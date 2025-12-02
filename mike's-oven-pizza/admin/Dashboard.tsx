import React, { useEffect, useState } from 'react';
import { DollarSign, Users, ShoppingBag, TrendingUp, Package, AlertCircle } from 'lucide-react';

interface Stats {
  totalVentas: number;
  totalClientes: number;
  totalPedidos: number;
  totalProductos: number;
  pedidosPendientes: number;
  incidenciasPendientes: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalVentas: 0,
    totalClientes: 0,
    totalPedidos: 0,
    totalProductos: 0,
    pedidosPendientes: 0,
    incidenciasPendientes: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('❌ No hay token');
        setLoading(false);
        return;
      }
      
      try {
        const pedidosRes = await fetch('http://localhost:8080/pedidos/listar', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const pedidos = await pedidosRes.json();
        console.log('📦 Pedidos:', pedidos);
        
        const usuariosRes = await fetch('http://localhost:8080/users', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const usuarios = await usuariosRes.json();
        console.log('👥 Usuarios:', usuarios);
        
        const productosRes = await fetch('http://localhost:8080/productos/listar', {
          headers: { 'Content-Type': 'application/json' }
        });
        const productos = await productosRes.json();
        console.log('🍕 Productos:', productos);
        
        const incidenciasRes = await fetch('http://localhost:8080/incidencias-admin/listar', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const incidencias = await incidenciasRes.json();
        console.log('🚨 Incidencias:', incidencias);

        const totalVentas = pedidos.reduce((sum: number, p: any) => sum + p.total, 0);
        
        const pedidosPendientes = pedidos.filter((p: any) => p.estado === 'PENDIENTE').length;
        
        const incidenciasPendientes = incidencias.filter((i: any) => 
          i.estado === 'ABIERTO' || i.estado === 'EN_PROCESO'
        ).length;
        
        console.log('📊 Pedidos pendientes:', pedidosPendientes);
        console.log('🚨 Incidencias pendientes (ABIERTO + EN_PROCESO):', incidenciasPendientes);

        setStats({
          totalVentas,
          totalClientes: usuarios.length,
          totalPedidos: pedidos.length,
          totalProductos: productos.length,
          pedidosPendientes,
          incidenciasPendientes
        });
        
        setLoading(false);
      } catch (error) {
        console.error('❌ Error al cargar estadísticas:', error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    {
      title: 'Ventas Totales',
      value: `S/ ${stats.totalVentas.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-blue-500',
      bgLight: 'bg-blue-50'
    },
    {
      title: 'Total Clientes',
      value: stats.totalClientes,
      icon: Users,
      color: 'bg-green-500',
      bgLight: 'bg-green-50'
    },
    {
      title: 'Total Pedidos',
      value: stats.totalPedidos,
      icon: ShoppingBag,
      color: 'bg-purple-500',
      bgLight: 'bg-purple-50'
    },
    {
      title: 'Productos',
      value: stats.totalProductos,
      icon: Package,
      color: 'bg-orange-500',
      bgLight: 'bg-orange-50'
    },
    {
      title: 'Pedidos Pendientes',
      value: stats.pedidosPendientes,
      icon: TrendingUp,
      color: 'bg-yellow-500',
      bgLight: 'bg-yellow-50'
    },
    {
      title: 'Incidencias Pendientes',
      value: stats.incidenciasPendientes,
      icon: AlertCircle,
      color: 'bg-red-500',
      bgLight: 'bg-red-50'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#D14B4B]"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Análisis y estadísticas de Mike's Pizza</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${card.bgLight} p-3 rounded-lg`}>
                  <Icon className={`${card.color.replace('bg-', 'text-')} w-6 h-6`} />
                </div>
              </div>
              <h3 className="text-gray-500 text-sm font-medium mb-1">{card.title}</h3>
              <p className="text-3xl font-bold text-gray-800">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Resumen del Sistema</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600">Promedio por pedido:</span>
            <span className="font-bold text-[#D14B4B]">
              S/ {stats.totalPedidos > 0 ? (stats.totalVentas / stats.totalPedidos).toFixed(2) : '0.00'}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600">Pedidos completados:</span>
            <span className="font-bold text-green-600">{stats.totalPedidos - stats.pedidosPendientes}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">Tasa de conversión:</span>
            <span className="font-bold text-blue-600">
              {stats.totalClientes > 0 ? ((stats.totalPedidos / stats.totalClientes) * 100).toFixed(1) : '0'}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;