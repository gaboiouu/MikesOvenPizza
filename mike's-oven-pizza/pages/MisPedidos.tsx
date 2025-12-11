import React, { useEffect, useState } from 'react';
import { Package, Clock, CheckCircle, XCircle, Truck, MapPin, Phone, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DetallePedido {
  detalleId: number;
  nombreProducto: string;
  cantidad: number;
  tamanio?: string;
  subtotal: number;
}

interface Pedido {
  pedidoId: number;
  total: number;
  estado: string;
  fechaPedido: string;
  tipoPedido: string;
  direccion?: string;
  telefono?: string;
  detalles: DetallePedido[];
}

const MisPedidos: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      setError('No se encontró información de usuario');
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    
    console.log('🔍 Fetching pedidos para userId:', userId);
    
    fetch(`http://localhost:8080/pedidos/usuario/${userId}`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        console.log('📡 Response status:', res.status);
        if (!res.ok) {
          throw new Error('Error al cargar pedidos');
        }
        return res.json();
      })
      .then(data => {
        console.log('✅ Pedidos recibidos:', data);
        setPedidos(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Error:', err);
        setError('Error al cargar los pedidos');
        setLoading(false);
      });
  }, [userId]);

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'PENDIENTE':
        return <Clock className="text-yellow-500" size={20} />;
      case 'EN_PREPARACION':
        return <Package className="text-blue-500" size={20} />;
      case 'EN_CAMINO':
        return <Truck className="text-purple-500" size={20} />;
      case 'COMPLETADO':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'CANCELADO':
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <Clock className="text-gray-500" size={20} />;
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'PENDIENTE':
        return 'bg-yellow-100 text-yellow-800';
      case 'EN_PREPARACION':
        return 'bg-blue-100 text-blue-800';
      case 'EN_CAMINO':
        return 'bg-purple-100 text-purple-800';
      case 'COMPLETADO':
        return 'bg-green-100 text-green-800';
      case 'CANCELADO':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#0D4D45] mx-auto"></div>
          <p className="mt-4 text-gray-500 font-semibold">Cargando tus pedidos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <XCircle size={64} className="mx-auto text-red-500 mb-4" />
          <p className="text-red-500 text-lg font-semibold mb-4">{error}</p>
          <a 
            href="/login" 
            className="inline-block bg-[#0D4D45] text-white px-6 py-2 rounded-full font-bold hover:bg-[#074036] transition"
          >
            Volver al login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Mis Pedidos</h1>
            <p className="text-gray-600">Historial completo de tus pedidos en Mike's Pizza</p>
          </div>
          <Link 
            to="/menu"
            className="inline-flex items-center gap-2 bg-[#D14B4B] hover:bg-red-700 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition"
          >
            <Plus size={20} />
            Nuevo Pedido
          </Link>
        </div>

        {pedidos.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <Package size={80} className="mx-auto text-gray-300 mb-6" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">No tienes pedidos realizados</h2>
            <p className="text-gray-500 mb-6">¡Es hora de probar nuestras deliciosas pizzas!</p>
            <Link 
              to="/menu" 
              className="inline-flex items-center gap-2 bg-[#D14B4B] hover:bg-red-700 text-white px-8 py-3 rounded-full font-bold shadow-lg transition"
            >
              <Plus size={20} />
              Ver Menú
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pedidos
              .sort((a, b) => new Date(b.fechaPedido).getTime() - new Date(a.fechaPedido).getTime())
              .map((pedido) => (
                <div key={pedido.pedidoId} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
                  <div className="bg-gradient-to-r from-[#0D4D45] to-[#0a3b32] text-white p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold">
                        Pedido #{pedido.pedidoId}
                      </h3>
                      {getEstadoIcon(pedido.estado)}
                    </div>
                    <p className="text-gray-200 text-xs">
                      {new Date(pedido.fechaPedido).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>

                  <div className="p-4 flex-grow">
                    <div className="mb-4 p-3 bg-gradient-to-r from-[#D14B4B]/10 to-[#FF8F3A]/10 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Package size={18} className="text-[#D14B4B]" />
                        <p className="font-bold text-gray-800">{pedido.tipoPedido}</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      {pedido.direccion && (
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin size={16} className="text-[#0D4D45] flex-shrink-0 mt-0.5" />
                          <span className="text-gray-600 line-clamp-2">{pedido.direccion}</span>
                        </div>
                      )}
                      {pedido.telefono && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone size={16} className="text-[#25D366]" />
                          <span className="text-gray-600">{pedido.telefono}</span>
                        </div>
                      )}
                    </div>

                    <div className="mb-4">
                      <h4 className="font-bold text-gray-700 text-sm mb-2">Productos:</h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {pedido.detalles && pedido.detalles.length > 0 ? (
                          pedido.detalles.map((detalle) => (
                            <div key={detalle.detalleId} className="flex justify-between items-start bg-gray-50 p-2 rounded text-xs">
                              <div className="flex items-start gap-2 flex-1 min-w-0">
                                <span className="bg-[#D14B4B] text-white w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">
                                  {detalle.cantidad}
                                </span>
                                <div className="min-w-0 flex-1">
                                  <p className="font-semibold text-gray-800 truncate">{detalle.nombreProducto}</p>
                                  {detalle.tamanio && (
                                    <p className="text-gray-500 text-xs">{detalle.tamanio}</p>
                                  )}
                                </div>
                              </div>
                              <p className="font-bold text-[#D14B4B] text-sm whitespace-nowrap ml-2">
                                S/ {detalle.subtotal.toFixed(2)}
                              </p>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 text-xs text-center py-2">Sin detalles</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-t border-gray-100 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-700">Total:</span>
                      <span className="text-2xl font-bold text-[#D14B4B]">S/ {pedido.total.toFixed(2)}</span>
                    </div>
                    <span className={`inline-block w-full text-center px-3 py-2 rounded-lg text-xs font-bold ${getEstadoColor(pedido.estado)}`}>
                      {pedido.estado.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MisPedidos;
