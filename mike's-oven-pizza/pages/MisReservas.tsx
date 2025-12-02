import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Users, Phone, MessageSquare, CheckCircle, XCircle, AlertCircle, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Reserva {
  reservaId: number;
  nombre: string;
  nroPersonas: number;
  fecha: string;
  hora: string;
  telefono: string;
  mensajeAdicional?: string;
  estado: string;
  fechaCreacion: string;
}

const MisReservas: React.FC = () => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
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
    
    console.log('🔍 Buscando reservas para userId:', userId);
    console.log('🔑 Token:', token ? 'Presente' : 'No existe');
    
    fetch(`http://localhost:8080/reservas/mis-reservas/${userId}`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        console.log('📡 Response status:', res.status);
        if (!res.ok) {
          throw new Error('Error al cargar reservas');
        }
        return res.json();
      })
      .then(data => {
        console.log('✅ Reservas recibidas:', data);
        setReservas(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Error:', err);
        setError('Error al cargar las reservas');
        setLoading(false);
      });
  }, [userId]);

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'PENDIENTE':
        return <AlertCircle className="text-yellow-500" size={20} />;
      case 'CONFIRMADA':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'CANCELADA':
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <AlertCircle className="text-gray-500" size={20} />;
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'PENDIENTE':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMADA':
        return 'bg-green-100 text-green-800';
      case 'CANCELADA':
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
          <p className="mt-4 text-gray-500 font-semibold">Cargando tus reservas...</p>
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
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Mis Reservas</h1>
            <p className="text-gray-600">Historial completo de tus reservas en Mike's Pizza</p>
          </div>
          <Link 
            to="/reservas"  
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition"
          >
            <Plus size={20} />
            Nueva Reserva
          </Link>
        </div>

        {reservas.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <Calendar size={80} className="mx-auto text-gray-300 mb-6" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">No tienes reservas realizadas</h2>
            <p className="text-gray-500 mb-6">¡Reserva tu mesa y disfruta de nuestras pizzas!</p>
            <Link   
              to="/reservas" 
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-3 rounded-full font-bold shadow-lg transition"
            >
              <Plus size={20} />
              Hacer Reserva
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reservas
              .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
              .map((reserva) => (
                <div key={reserva.reservaId} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
                  <div className="bg-gradient-to-r from-[#0D4D45] to-[#0a3b32] text-white p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold">
                        Reserva #{reserva.reservaId}
                      </h3>
                      {getEstadoIcon(reserva.estado)}
                    </div>
                    <p className="text-gray-200 text-sm truncate">
                      {reserva.nombre}
                    </p>
                  </div>

                  <div className="p-4 flex-grow">
                    <div className="mb-4 p-3 bg-gradient-to-r from-[#D14B4B]/10 to-[#FF8F3A]/10 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar size={18} className="text-[#D14B4B]" />
                        <p className="font-semibold text-gray-800 text-sm">
                          {new Date(reserva.fecha + 'T00:00:00').toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={18} className="text-[#FF8F3A]" />
                        <p className="font-bold text-gray-800 text-lg">{reserva.hora}</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Users size={16} className="text-[#0D4D45]" />
                        <span className="text-gray-600">{reserva.nroPersonas} personas</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone size={16} className="text-[#25D366]" />
                        <span className="text-gray-600">{reserva.telefono}</span>
                      </div>
                    </div>

                    {reserva.mensajeAdicional && (
                      <div className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg mb-3">
                        <MessageSquare size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-gray-700 line-clamp-2">{reserva.mensajeAdicional}</p>
                      </div>
                    )}
                  </div>

                  <div className="p-4 border-t border-gray-100">
                    <span className={`inline-block w-full text-center px-3 py-2 rounded-lg text-xs font-bold ${getEstadoColor(reserva.estado)}`}>
                      {reserva.estado}
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

export default MisReservas;