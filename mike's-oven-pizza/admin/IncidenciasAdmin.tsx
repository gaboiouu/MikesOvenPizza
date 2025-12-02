import React, { useEffect, useState } from 'react';
import { Incident, TipoIncidencia, IncidentStatus, IncidentPriority, TIPO_INCIDENCIA_DISPLAY } from '../types';
import { AlertTriangle, CheckCircle, Clock, Plus, Filter, Flame, Package, Truck, DollarSign, Zap, Users, Trash2, Wrench, Lock, FileText, X } from 'lucide-react';

const getTipoIcon = (tipo: TipoIncidencia, size: number = 20) => {
  switch(tipo) {
    case TipoIncidencia.PRODUCCION_COCINA: return <Flame size={size} className="text-red-500" />;
    case TipoIncidencia.PEDIDOS: return <Package size={size} className="text-blue-500" />;
    case TipoIncidencia.DELIVERY: return <Truck size={size} className="text-orange-500" />;
    case TipoIncidencia.CAJA_PAGOS: return <DollarSign size={size} className="text-green-600" />;
    case TipoIncidencia.SISTEMA: return <Zap size={size} className="text-yellow-500" />;
    case TipoIncidencia.PERSONAL: return <Users size={size} className="text-purple-500" />;
    case TipoIncidencia.LIMPIEZA_SEGURIDAD: return <Trash2 size={size} className="text-gray-600" />;
    case TipoIncidencia.INFRAESTRUCTURA: return <Wrench size={size} className="text-amber-600" />;
    case TipoIncidencia.SEGURIDAD: return <Lock size={size} className="text-red-600" />;
    case TipoIncidencia.ADMINISTRATIVA: return <FileText size={size} className="text-indigo-600" />;
    default: return null;
  }
};

const TIPOS_INCIDENCIA: TipoIncidencia[] = Object.values(TipoIncidencia);

const API_URL = 'http://localhost:8080/incidencias-admin';

const IncidenciasAdmin: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isModalFormOpen, setIsModalFormOpen] = useState(false);
  const [isModalTipoOpen, setIsModalTipoOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [loading, setLoading] = useState(false);

  const [newIncident, setNewIncident] = useState<Partial<Incident>>({
    titulo: '',
    tipo: undefined,
    descripcion: '',
    prioridad: IncidentPriority.MEDIA,
    responsable: '',
    estado: IncidentStatus.ABIERTO
  });

  const [editData, setEditData] = useState<Partial<Incident>>({
    estado: IncidentStatus.ABIERTO,
    prioridad: IncidentPriority.MEDIA,
    responsable: ''
  });

  const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  const loadIncidents = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/listar`, {
        method: 'GET',
        headers: getHeaders()
      });
      
      if (response.ok) {
        const data = await response.json();
        setIncidents(data);
      } else {
        console.error('Error al cargar incidencias');
      }
    } catch (error) {
      console.error('Error de conexión:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newIncident.tipo) {
      alert('Debe seleccionar un tipo de incidencia');
      return;
    }

    setLoading(true);
    
    // ✅ Corregido: Obtener userId directamente de localStorage
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
      alert('❌ No se encontró información de usuario');
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/crear`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          tipo: newIncident.tipo,
          titulo: newIncident.titulo,
          descripcion: newIncident.descripcion,
          prioridad: newIncident.prioridad,
          responsable: newIncident.responsable,
          reportadoPorId: parseInt(userId),  // ✅ Convertir a número
          creadoPorId: parseInt(userId)      // ✅ Convertir a número
        })
      });

      if (response.ok) {
        await loadIncidents();
        setIsModalFormOpen(false);
        setNewIncident({
          titulo: '',
          tipo: undefined,
          descripcion: '',
          prioridad: IncidentPriority.MEDIA,
          responsable: '',
          estado: IncidentStatus.ABIERTO
        });
        alert('✅ Incidencia creada exitosamente');
      } else {
        const errorData = await response.text();
        console.error('Error del servidor:', errorData);
        alert('❌ Error al crear incidencia: ' + errorData);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedIncident) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/${selectedIncident.id}`,
        {
          method: 'PUT',
          headers: getHeaders(),
          body: JSON.stringify({
            titulo: selectedIncident.titulo,
            descripcion: selectedIncident.descripcion,
            estado: editData.estado,
            prioridad: editData.prioridad,
            responsable: editData.responsable,
            tipo: selectedIncident.tipo
          })
        }
      );

      if (response.ok) {
        await loadIncidents();
        setIsModalEditOpen(false);
        setSelectedIncident(null);
        alert('✅ Incidencia actualizada exitosamente');
      } else {
        alert('❌ Error al actualizar incidencia');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar esta incidencia?')) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });

      if (response.ok) {
        await loadIncidents();
        alert('✅ Incidencia eliminada');
      } else {
        alert('❌ Error al eliminar incidencia');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (p: IncidentPriority) => {
    switch(p) {
      case IncidentPriority.ALTA: return 'bg-red-100 text-red-800 border-red-200';
      case IncidentPriority.MEDIA: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case IncidentPriority.BAJA: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getStatusIcon = (s: IncidentStatus) => {
    switch(s) {
      case IncidentStatus.ABIERTO: return <AlertTriangle size={16} className="text-red-500" />;
      case IncidentStatus.EN_PROCESO: return <Clock size={16} className="text-blue-500" />;
      case IncidentStatus.CERRADO: return <CheckCircle size={16} className="text-green-500" />;
    }
  };

  const filteredIncidents = filterStatus === 'ALL'
    ? incidents
    : incidents.filter(i => i.estado === filterStatus);

  const seleccionarTipo = (tipo: TipoIncidencia) => {
    setNewIncident({
      ...newIncident,
      tipo: tipo
    });
    setIsModalTipoOpen(false);
    setIsModalFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-3 sm:p-6 transition-colors duration-300">
      <style>{`
        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-slideInDown {
          animation: slideInDown 0.5s ease-out;
        }
        
        .animate-slideInUp {
          animation: slideInUp 0.5s ease-out;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
        
        .hover-scale {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .hover-scale:hover {
          transform: scale(1.02);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        
        .button-hover {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .button-hover:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
        }
        
        .modal-overlay {
          animation: fadeIn 0.2s ease-out;
        }
        
        .modal-content {
          animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .table-row-hover {
          transition: all 0.2s ease;
        }
        
        .table-row-hover:hover {
          background-color: rgba(13, 77, 69, 0.05);
          transform: scale(1.01);
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover-scale animate-slideInDown">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A]">Gestión de Incidencias</h1>
            <p className="text-xs sm:text-sm text-gray-500">ITIL v4 - Operación del Servicio</p>
          </div>
          <button 
            onClick={() => setIsModalTipoOpen(true)}
            className="w-full sm:w-auto bg-[#0D4D45] text-white px-4 py-2 sm:py-3 rounded-lg flex items-center justify-center sm:justify-start gap-2 hover:bg-[#08332e] transition-all duration-300 font-medium button-hover animate-float text-sm sm:text-base"
          >
            <Plus size={20} /> Nueva Incidencia
          </button>
        </header>

        <div className="flex items-center gap-3 mb-4 sm:mb-6 animate-slideInUp">
          <Filter size={20} className="text-gray-400 flex-shrink-0" />
          <select 
            className="w-full sm:flex-1 p-2 sm:p-3 rounded-lg border border-gray-300 bg-white text-gray-800 text-sm sm:text-base transition-all duration-200 hover:border-[#0D4D45] focus:border-[#0D4D45] focus:outline-none focus:ring-2 focus:ring-[#0D4D45] focus:ring-opacity-50"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="ALL">Todos los estados</option>
            <option value={IncidentStatus.ABIERTO}>{IncidentStatus.ABIERTO}</option>
            <option value={IncidentStatus.EN_PROCESO}>{IncidentStatus.EN_PROCESO}</option>
            <option value={IncidentStatus.CERRADO}>{IncidentStatus.CERRADO}</option>
          </select>
        </div>

        {loading && <p className="text-center text-gray-500 animate-fadeIn">Cargando...</p>}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover-scale animate-slideInUp">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold tracking-wider border-b border-gray-200">
                <tr>
                  <th className="p-4">Estado</th>
                  <th className="p-4">Prioridad</th>
                  <th className="p-4">Tipo</th>
                  <th className="p-4">Título / Descripción</th>
                  <th className="p-4">Responsable</th>
                  <th className="p-4">Fecha</th>
                  <th className="p-4">Creado por</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredIncidents.map((incident, idx) => (
                  <tr key={incident.id} className="table-row-hover" style={{animationDelay: `${idx * 0.05}s`}}>
                    <td className="p-4">
                      <div className="flex items-center gap-2 font-medium text-gray-800">
                        {getStatusIcon(incident.estado)} 
                        <span className="text-sm">{incident.estado}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded text-xs font-bold border transition-all duration-200 ${getPriorityColor(incident.prioridad)}`}>
                        {incident.prioridad}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getTipoIcon(incident.tipo, 18)}
                        <span className="text-sm font-medium text-gray-700">{TIPO_INCIDENCIA_DISPLAY[incident.tipo]}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-gray-800 text-sm">{incident.titulo}</div>
                      <div className="text-xs text-gray-600 truncate max-w-xs">{incident.descripcion}</div>
                    </td>
                    <td className="p-4 text-sm text-gray-700">{incident.responsable || 'Sin asignar'}</td>
                    <td className="p-4 text-sm text-gray-600">{incident.fechaCreacion}</td>
                    <td className="p-4 text-sm text-gray-700">{incident.creadoPorNombre}</td>
                    <td className="p-4 text-right space-x-2">
                      <button 
                        onClick={() => {
                          setSelectedIncident(incident);
                          setEditData({
                            estado: incident.estado,
                            prioridad: incident.prioridad,
                            responsable: incident.responsable
                          });
                          setIsModalEditOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 underline text-sm font-medium button-hover transition-colors duration-200"
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => handleDelete(incident.id)}
                        className="text-red-600 hover:text-red-800 underline text-sm font-medium button-hover transition-colors duration-200"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden">
            {filteredIncidents.map((incident, idx) => (
              <div 
                key={incident.id} 
                className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-all duration-200 animate-slideInUp"
                style={{animationDelay: `${idx * 0.05}s`}}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(incident.estado)}
                    <span className="font-bold text-gray-800 text-sm">{incident.estado}</span>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-bold border ${getPriorityColor(incident.prioridad)}`}>
                    {incident.prioridad}
                  </span>
                </div>
                
                <h3 className="font-bold text-gray-800 mb-2 text-sm">{incident.titulo}</h3>
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">{incident.descripcion}</p>
                
                <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                  <div>
                    <p className="text-gray-500">Tipo:</p>
                    <p className="text-gray-700 flex items-center gap-1">
                      {getTipoIcon(incident.tipo, 14)}
                      {TIPO_INCIDENCIA_DISPLAY[incident.tipo]}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Responsable:</p>
                    <p className="text-gray-700">{incident.responsable || 'Sin asignar'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Fecha:</p>
                    <p className="text-gray-700">{incident.fechaCreacion}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Creado por:</p>
                    <p className="text-gray-700">{incident.creadoPorNombre}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setSelectedIncident(incident);
                      setEditData({
                        estado: incident.estado,
                        prioridad: incident.prioridad,
                        responsable: incident.responsable
                      });
                      setIsModalEditOpen(true);
                    }}
                    className="flex-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded py-2 text-xs font-medium button-hover transition-all duration-200"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(incident.id)}
                    className="flex-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded py-2 text-xs font-medium button-hover transition-all duration-200"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredIncidents.length === 0 && !loading && (
            <div className="p-8 text-center text-gray-500 animate-fadeIn">No se encontraron incidencias.</div>
          )}
        </div>
      </div>

      {isModalTipoOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 modal-overlay">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 modal-content border border-gray-200">
            <h2 className="text-xl sm:text-2xl font-bold mb-6 text-[#1A1A1A]">Seleccionar Tipo de Incidencia</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {TIPOS_INCIDENCIA.map((tipo, idx) => (
                <button
                  key={tipo}
                  onClick={() => seleccionarTipo(tipo)}
                  style={{animationDelay: `${idx * 0.05}s`}}
                  className="p-3 sm:p-4 bg-white text-gray-800 rounded-lg shadow border-2 border-[#0D4D45] hover:bg-gray-50 hover:border-[#086d63] transition-all duration-300 font-medium text-xs sm:text-sm flex items-center gap-2 sm:gap-3 justify-start button-hover animate-scaleIn"
                >
                  {getTipoIcon(tipo, 20)}
                  <span className="text-left line-clamp-2">{TIPO_INCIDENCIA_DISPLAY[tipo]}</span>
                </button>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setIsModalTipoOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 button-hover text-sm sm:text-base"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 modal-overlay">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden modal-content border border-gray-200">
            <div className="bg-[#1A1A1A] px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg sm:text-xl font-bold text-white">Registrar Incidencia</h3>
              <button onClick={() => setIsModalFormOpen(false)} className="text-gray-400 hover:text-white transition-colors duration-200">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">Tipo de Incidencia</label>
                <input 
                  required
                  className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 bg-gray-50 text-gray-800 text-sm transition-all duration-200 hover:border-[#0D4D45] focus:border-[#0D4D45] focus:outline-none focus:ring-2 focus:ring-[#0D4D45] focus:ring-opacity-50"
                  value={newIncident.tipo ? TIPO_INCIDENCIA_DISPLAY[newIncident.tipo] : ''}
                  readOnly
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">Título</label>
                <input 
                  required
                  className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 bg-white text-gray-800 text-sm transition-all duration-200 hover:border-[#0D4D45] focus:border-[#0D4D45] focus:outline-none focus:ring-2 focus:ring-[#0D4D45] focus:ring-opacity-50"
                  value={newIncident.titulo || ''}
                  onChange={e => setNewIncident({...newIncident, titulo: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">Descripción</label>
                <textarea 
                  required
                  className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 bg-white text-gray-800 text-sm transition-all duration-200 hover:border-[#0D4D45] focus:border-[#0D4D45] focus:outline-none focus:ring-2 focus:ring-[#0D4D45] focus:ring-opacity-50 resize-none"
                  rows={3}
                  value={newIncident.descripcion || ''}
                  onChange={e => setNewIncident({...newIncident, descripcion: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">Prioridad</label>
                  <select 
                    className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 bg-white text-gray-800 text-sm transition-all duration-200 hover:border-[#0D4D45] focus:border-[#0D4D45] focus:outline-none focus:ring-2 focus:ring-[#0D4D45] focus:ring-opacity-50"
                    value={newIncident.prioridad}
                    onChange={e => setNewIncident({...newIncident, prioridad: e.target.value as IncidentPriority})}
                  >
                    {Object.values(IncidentPriority).map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">Responsable</label>
                  <input
                    className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 bg-white text-gray-800 text-sm transition-all duration-200 hover:border-[#0D4D45] focus:border-[#0D4D45] focus:outline-none focus:ring-2 focus:ring-[#0D4D45] focus:ring-opacity-50"
                    value={newIncident.responsable || ''}
                    onChange={e => setNewIncident({...newIncident, responsable: e.target.value})}
                  />
                </div>
              </div>

              <div className="pt-4 flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalFormOpen(false)} 
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 button-hover font-medium text-sm"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="px-4 py-2 bg-[#0D4D45] text-white rounded-lg hover:bg-[#08332e] font-bold disabled:opacity-50 transition-all duration-300 button-hover text-sm animate-float"
                >
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isModalEditOpen && selectedIncident && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 modal-overlay">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden modal-content border border-gray-200">
            <div className="bg-[#1A1A1A] px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg sm:text-xl font-bold text-white">Actualizar Incidencia</h3>
              <button onClick={() => setIsModalEditOpen(false)} className="text-gray-400 hover:text-white transition-colors duration-200">
                <X size={24} />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Incidencia: <strong className="text-gray-800">{selectedIncident.titulo}</strong></p>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">Estado</label>
                <select 
                  className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 bg-white text-gray-800 text-sm transition-all duration-200 hover:border-[#0D4D45] focus:border-[#0D4D45] focus:outline-none focus:ring-2 focus:ring-[#0D4D45] focus:ring-opacity-50"
                  value={editData.estado}
                  onChange={e => setEditData({...editData, estado: e.target.value as IncidentStatus})}
                >
                  {Object.values(IncidentStatus).map(estado => (
                    <option key={estado} value={estado}>{estado}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">Prioridad</label>
                <select 
                  className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 bg-white text-gray-800 text-sm transition-all duration-200 hover:border-[#0D4D45] focus:border-[#0D4D45] focus:outline-none focus:ring-2 focus:ring-[#0D4D45] focus:ring-opacity-50"
                  value={editData.prioridad}
                  onChange={e => setEditData({...editData, prioridad: e.target.value as IncidentPriority})}
                >
                  {Object.values(IncidentPriority).map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">Responsable</label>
                <input 
                  className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 bg-white text-gray-800 text-sm transition-all duration-200 hover:border-[#0D4D45] focus:border-[#0D4D45] focus:outline-none focus:ring-2 focus:ring-[#0D4D45] focus:ring-opacity-50"
                  value={editData.responsable || ''}
                  onChange={e => setEditData({...editData, responsable: e.target.value})}
                />
              </div>
              <div className="pt-4 flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
                <button 
                  onClick={() => setIsModalEditOpen(false)} 
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 button-hover font-medium text-sm"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleUpdate}
                  disabled={loading}
                  className="px-4 py-2 bg-[#0D4D45] text-white rounded-lg hover:bg-[#08332e] font-bold disabled:opacity-50 transition-all duration-300 button-hover text-sm animate-float"
                >
                  {loading ? 'Actualizando...' : 'Actualizar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncidenciasAdmin;
