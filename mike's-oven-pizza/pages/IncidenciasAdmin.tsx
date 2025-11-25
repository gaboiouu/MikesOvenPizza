import React, { useEffect, useState } from 'react';
import { IncidentService } from '../services/api';
import { Incident, IncidentStatus, IncidentPriority } from '../types';
import { AlertTriangle, CheckCircle, Clock, Plus, Filter } from 'lucide-react';

const IncidenciasAdmin: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const [newIncident, setNewIncident] = useState<Partial<Incident>>({
    title: '',
    description: '',
    priority: IncidentPriority.MEDIUM,
    responsible: '',
    status: IncidentStatus.OPEN
  });

  useEffect(() => {
    const load = async () => {
      const data = await IncidentService.getAll();
      setIncidents(data);
    };
    load();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await IncidentService.create({
      ...newIncident,
      createdAt: new Date().toISOString().split('T')[0]
    } as Incident);
    setIncidents([...incidents, created]);
    setIsModalOpen(false);
  };

  const getPriorityColor = (p: IncidentPriority) => {
    switch(p) {
      case IncidentPriority.HIGH: return 'bg-red-100 text-red-800 border-red-200';
      case IncidentPriority.MEDIUM: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case IncidentPriority.LOW: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getStatusIcon = (s: IncidentStatus) => {
    switch(s) {
      case IncidentStatus.OPEN: return <AlertTriangle size={16} className="text-red-500" />;
      case IncidentStatus.IN_PROGRESS: return <Clock size={16} className="text-blue-500" />;
      case IncidentStatus.CLOSED: return <CheckCircle size={16} className="text-green-500" />;
    }
  };

  const filteredIncidents = filterStatus === 'ALL' 
    ? incidents 
    : incidents.filter(i => i.status === filterStatus);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-[#1A1A1A]">Gestión de Incidencias</h1>
            <p className="text-sm text-gray-500">ITIL v4 - Operación del Servicio</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#0D4D45] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#08332e] transition-colors font-medium"
          >
            <Plus size={20} /> Nueva Incidencia
          </button>
        </header>

        <div className="flex items-center gap-4 mb-6">
          <Filter size={20} className="text-gray-400" />
          <select 
            className="p-2 rounded border border-gray-300 bg-white"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="ALL">Todos los estados</option>
            <option value={IncidentStatus.OPEN}>{IncidentStatus.OPEN}</option>
            <option value={IncidentStatus.IN_PROGRESS}>{IncidentStatus.IN_PROGRESS}</option>
            <option value={IncidentStatus.CLOSED}>{IncidentStatus.CLOSED}</option>
          </select>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold tracking-wider">
              <tr>
                <th className="p-4">Estado</th>
                <th className="p-4">Prioridad</th>
                <th className="p-4">Título / Descripción</th>
                <th className="p-4">Responsable</th>
                <th className="p-4">Fecha</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredIncidents.map((incident) => (
                <tr key={incident.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2 font-medium">
                      {getStatusIcon(incident.status)} {incident.status}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold border ${getPriorityColor(incident.priority)}`}>
                      {incident.priority}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-gray-800">{incident.title}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{incident.description}</div>
                  </td>
                  <td className="p-4 text-sm">{incident.responsible}</td>
                  <td className="p-4 text-sm text-gray-500">{incident.createdAt}</td>
                  <td className="p-4 text-right">
                    <button className="text-blue-600 hover:underline text-sm font-medium">Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredIncidents.length === 0 && (
            <div className="p-8 text-center text-gray-500">No se encontraron incidencias.</div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="bg-[#1A1A1A] px-6 py-4 flex justify-between items-center">
              <h3 className="text-white font-bold">Registrar Incidencia</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><Plus className="rotate-45" /></button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Título</label>
                <input 
                  required
                  className="w-full border border-gray-300 rounded p-2"
                  value={newIncident.title}
                  onChange={e => setNewIncident({...newIncident, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Descripción</label>
                <textarea 
                  required
                  className="w-full border border-gray-300 rounded p-2"
                  rows={3}
                  value={newIncident.description}
                  onChange={e => setNewIncident({...newIncident, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Prioridad</label>
                  <select 
                    className="w-full border border-gray-300 rounded p-2"
                    value={newIncident.priority}
                    onChange={e => setNewIncident({...newIncident, priority: e.target.value as IncidentPriority})}
                  >
                    {Object.values(IncidentPriority).map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Responsable</label>
                  <input 
                    required
                    className="w-full border border-gray-300 rounded p-2"
                    value={newIncident.responsible}
                    onChange={e => setNewIncident({...newIncident, responsible: e.target.value})}
                  />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-[#0D4D45] text-white rounded hover:bg-[#08332e] font-bold">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncidenciasAdmin;