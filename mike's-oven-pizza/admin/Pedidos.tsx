import React, { useEffect, useState } from 'react';
import { Package, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';

interface Pedido {
  pedidoId: number;
  total: number;
  estado: string;
  fechaPedido: string;
  tipoPedido: string;
  direccion?: string;
  telefono?: string;
  usuario?: {
    nombreCompleto: string;
    email: string;
  };
}

enum EstadoPedido {
  PENDIENTE = 'PENDIENTE',
  ENTREGADO = 'ENTREGADO',
  CANCELADO = 'CANCELADO'
}

const Pedidos: React.FC = () => {
  const { notification, showToast, hideToast } = useToast();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterEstado, setFilterEstado] = useState('TODOS');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 20; 

  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async (pageNum: number = page) => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('Sesión expirada. Por favor, inicia sesión nuevamente.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/pedidos/listar-paginado?page=${pageNum}&size=${pageSize}&sort=fechaPedido,desc`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Pedidos recibidos:', data);
        
        // ✅ MANEJAR RESPUESTA PAGINADA
        setPedidos(data.content || data);
        setTotalPages(data.totalPages || 1);
        setTotalElements(data.totalElements || data.length);
        setPage(pageNum);
        setError(null);
      } else {
        const errorText = await response.text();
        console.error('❌ Error del servidor:', errorText);
        setError(`Error al cargar pedidos: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Error de conexión:', error);
      setError('No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  const updateEstado = async (pedidoId: number, nuevoEstado: EstadoPedido) => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:8080/pedidos/${pedidoId}/estado?nuevoEstado=${nuevoEstado}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        showToast('success', '✅ Estado actualizado exitosamente');
        fetchPedidos();
      } else {
        const errorText = await response.text();
        console.error('❌ Error:', errorText);
        showToast('error', `Error al actualizar estado: ${errorText}`);
      }
    } catch (error) {
      console.error('❌ Error:', error);
      showToast('error', 'Error de conexión al actualizar estado');
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case EstadoPedido.PENDIENTE:
        return <Clock className="text-yellow-500" size={20} />;
      case EstadoPedido.ENTREGADO:
        return <CheckCircle className="text-green-500" size={20} />;
      case EstadoPedido.CANCELADO:
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <Package className="text-gray-500" size={20} />;
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case EstadoPedido.PENDIENTE:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case EstadoPedido.ENTREGADO:
        return 'bg-green-100 text-green-800 border-green-300';
      case EstadoPedido.CANCELADO:
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getEstadoLabel = (estado: string) => {
    switch (estado) {
      case EstadoPedido.PENDIENTE:
        return 'Pendiente';
      case EstadoPedido.ENTREGADO:
        return 'Entregado';
      case EstadoPedido.CANCELADO:
        return 'Cancelado';
      default:
        return estado;
    }
  };

  const filteredPedidos = filterEstado === 'TODOS'
    ? pedidos
    : pedidos.filter(p => p.estado === filterEstado);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#D14B4B] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando pedidos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md text-center">
          <XCircle className="text-red-500 mx-auto mb-4" size={48} />
          <h3 className="text-xl font-bold text-red-800 mb-2">Error al cargar pedidos</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => {
              setLoading(true);
              setError(null);
              fetchPedidos();
            }}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition font-bold"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {notification && (
        <Toast
          type={notification.type}
          message={notification.message}
          onClose={hideToast}
        />
      )}
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestión de Pedidos</h1>
        <p className="text-gray-600">Total de pedidos: {pedidos.length}</p>
      </div>

      <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <select
          value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D4D45]"
        >
          <option value="TODOS">Todos los estados</option>
          <option value={EstadoPedido.PENDIENTE}>Pendiente</option>
          <option value={EstadoPedido.ENTREGADO}>Entregado</option>
          <option value={EstadoPedido.CANCELADO}>Cancelado</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 text-left text-xs font-bold text-gray-600 uppercase">ID</th>
                <th className="p-4 text-left text-xs font-bold text-gray-600 uppercase">Cliente</th>
                <th className="p-4 text-left text-xs font-bold text-gray-600 uppercase">Total</th>
                <th className="p-4 text-left text-xs font-bold text-gray-600 uppercase">Estado</th>
                <th className="p-4 text-left text-xs font-bold text-gray-600 uppercase">Fecha</th>
                <th className="p-4 text-left text-xs font-bold text-gray-600 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPedidos
                .sort((a, b) => new Date(b.fechaPedido).getTime() - new Date(a.fechaPedido).getTime())
                .map((pedido) => (
                  <tr key={pedido.pedidoId} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-sm font-bold text-gray-800">#{pedido.pedidoId}</td>
                    <td className="p-4">
                      {pedido.usuario ? (
                        <div>
                          <p className="font-medium text-gray-800">{pedido.usuario.nombreCompleto}</p>
                          <p className="text-xs text-gray-500">{pedido.usuario.email}</p>
                        </div>
                      ) : (
                        <div>
                          <p className="font-medium text-gray-500">Usuario desconocido</p>
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-lg font-bold text-[#D14B4B]">S/ {pedido.total.toFixed(2)}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getEstadoIcon(pedido.estado)}
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getEstadoColor(pedido.estado)}`}>
                          {getEstadoLabel(pedido.estado)}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {new Date(pedido.fechaPedido).toLocaleString('es-ES')}
                    </td>
                    <td className="p-4">
                      <select
                        value={pedido.estado}
                        onChange={(e) => updateEstado(pedido.pedidoId, e.target.value as EstadoPedido)}
                        className="p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D4D45]"
                      >
                        <option value={EstadoPedido.PENDIENTE}>Pendiente</option>
                        <option value={EstadoPedido.ENTREGADO}>Entregado</option>
                        <option value={EstadoPedido.CANCELADO}>Cancelado</option>
                      </select>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {filteredPedidos.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No se encontraron pedidos.
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Mostrando {page * pageSize + 1} - {Math.min((page + 1) * pageSize, totalElements)} de {totalElements} pedidos
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => fetchPedidos(page - 1)}
              disabled={page === 0}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <span className="px-4 py-2 bg-white border border-gray-300 rounded-lg">
              Página {page + 1} de {totalPages}
            </span>
            <button
              onClick={() => fetchPedidos(page + 1)}
              disabled={page >= totalPages - 1}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pedidos;