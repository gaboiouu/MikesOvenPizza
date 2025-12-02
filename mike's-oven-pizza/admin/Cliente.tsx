import React, { useEffect, useState } from 'react';
import { Users, Mail, Phone, Calendar, Shield, Search } from 'lucide-react';

interface Cliente {
  id: number;
  nombreCompleto: string;
  email: string;
  telefono: string;
  rol: string;
  puntos: number;
  fechaRegistro: string;
}

const Clientes: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('⚠️ Sesión expirada. Por favor, inicia sesión nuevamente.');
      window.location.href = '/#/login';
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setClientes(data);
      } else {
        alert('⚠️ Error al cargar clientes');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('⚠️ Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const filteredClientes = clientes.filter(c =>
    c.nombreCompleto.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const getRolColor = (rol: string) => {
    switch (rol) {
      case 'MASTER': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'ADMIN': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'CLIENTE': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

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
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestión de Clientes</h1>
        <p className="text-gray-600">Total de usuarios registrados: {clientes.length}</p>
      </div>

      <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-3">
          <Search size={20} className="text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D4D45]"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 text-left text-xs font-bold text-gray-600 uppercase">ID</th>
                <th className="p-4 text-left text-xs font-bold text-gray-600 uppercase">Nombre</th>
                <th className="p-4 text-left text-xs font-bold text-gray-600 uppercase">Email</th>
                <th className="p-4 text-left text-xs font-bold text-gray-600 uppercase">Teléfono</th>
                <th className="p-4 text-left text-xs font-bold text-gray-600 uppercase">Rol</th>
                <th className="p-4 text-left text-xs font-bold text-gray-600 uppercase">Puntos</th>
                <th className="p-4 text-left text-xs font-bold text-gray-600 uppercase">Registro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredClientes.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm font-bold text-gray-800">#{cliente.id}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-[#D14B4B] rounded-full flex items-center justify-center text-white font-bold">
                        {cliente.nombreCompleto.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-800">{cliente.nombreCompleto}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail size={16} />
                      {cliente.email}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone size={16} />
                      {cliente.telefono || 'N/A'}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getRolColor(cliente.rol)}`}>
                      {cliente.rol}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-bold text-[#FF8F3A]">{cliente.puntos} pts</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={16} />
                      {new Date(cliente.fechaRegistro).toLocaleDateString('es-ES')}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredClientes.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No se encontraron clientes con ese criterio de búsqueda.
          </div>
        )}
      </div>
    </div>
  );
};

export default Clientes;