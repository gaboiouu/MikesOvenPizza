import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Users, Mail, Phone, XCircle } from 'lucide-react';

interface Reserva {
  id: number;  
  fecha: string; 
  hora: string;  
  nroPersonas: number;  
  mensajeAdicional: string; 
  telefono?: string;
  usuario?: {
    id: number;
    nombreCompleto: string;
    email: string;
    telefono: string;
  };
}

const Reservas: React.FC = () => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 20; 

  useEffect(() => {
    fetchReservas();
  }, []);

  const fetchReservas = async (pageNum: number = page) => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('Sesión expirada. Por favor, inicia sesión nuevamente.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/reservas/listar-paginado?page=${pageNum}&size=${pageSize}&sort=fecha,desc`,
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
        console.log('✅ Reservas recibidas:', data);
        
        setReservas(data.content || data);
        setTotalPages(data.totalPages || 1);
        setTotalElements(data.totalElements || data.length);
        setPage(pageNum);
        setError(null);
      } else {
        const errorText = await response.text();
        console.error('❌ Error del servidor:', errorText);
        setError(`Error al cargar reservas: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Error de conexión:', error);
      setError('No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#D14B4B] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando reservas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md text-center">
          <XCircle className="text-red-500 mx-auto mb-4" size={48} />
          <h3 className="text-xl font-bold text-red-800 mb-2">Error al cargar reservas</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => {
              setLoading(true);
              setError(null);
              fetchReservas();
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestión de Reservas</h1>
        <p className="text-gray-600">Total de reservas: {reservas.length}</p>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 text-left text-xs font-bold text-gray-600 uppercase">ID</th>
                <th className="p-4 text-left text-xs font-bold text-gray-600 uppercase">Cliente</th>
                <th className="p-4 text-left text-xs font-bold text-gray-600 uppercase">Fecha y Hora</th>
                <th className="p-4 text-center text-xs font-bold text-gray-600 uppercase">Personas</th>
                <th className="p-4 text-left text-xs font-bold text-gray-600 uppercase">Teléfono</th>
                <th className="p-4 text-left text-xs font-bold text-gray-600 uppercase">Detalles de Reserva</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reservas
                .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
                .map((reserva) => (
                  <tr key={reserva.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-sm font-bold text-gray-800">
                      #{reserva.id}
                    </td>
                    
                    <td className="p-4">
                      {reserva.usuario ? (
                        <div>
                          <p className="font-bold text-gray-800 text-base mb-1">
                            {reserva.usuario.nombreCompleto}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center gap-2">
                            <Mail size={12} />
                            {reserva.usuario.email}
                          </p>
                        </div>
                      ) : (
                        <p className="font-medium text-gray-500">Sin información</p>
                      )}
                    </td>
                    
                    <td className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Calendar size={18} className="text-[#0D4D45]" />
                          <span className="font-semibold">
                            {new Date(reserva.fecha).toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Clock size={18} className="text-[#FF8F3A]" />
                          <span className="font-bold text-lg">{reserva.hora}</span>
                        </div>
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <div className="flex justify-center">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF8F3A] to-[#D14B4B] text-white px-4 py-2 rounded-full shadow-lg">
                          <Users size={20} />
                          <span className="text-xl font-black">{reserva.nroPersonas}</span>
                        </div>
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone size={16} className="text-green-600" />
                        <span className="font-medium">
                          {reserva.telefono || reserva.usuario?.telefono || 'N/A'}
                        </span>
                      </div>
                    </td>
                    
                    <td className="p-4 max-w-xs">
                      {reserva.mensajeAdicional ? (
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                          <p className="text-sm text-gray-700 italic">
                            "{reserva.mensajeAdicional}"
                          </p>
                        </div>
                      ) : (
                        <div className="text-center py-2">
                          <span className="text-gray-400 text-sm">Sin detalles adicionales</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {reservas.length === 0 && (
          <div className="p-12 text-center">
            <Calendar size={64} className="mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg">No hay reservas registradas</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Mostrando {page * pageSize + 1} - {Math.min((page + 1) * pageSize, totalElements)} de {totalElements} reservas
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => fetchReservas(page - 1)}
                disabled={page === 0}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="px-4 py-2 bg-white border border-gray-300 rounded-lg">
                Página {page + 1} de {totalPages}
              </span>
              <button
                onClick={() => fetchReservas(page + 1)}
                disabled={page >= totalPages - 1}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reservas;