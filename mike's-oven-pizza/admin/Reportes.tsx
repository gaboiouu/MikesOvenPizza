import React, { useState } from 'react';
import { FileText, Download, Calendar } from 'lucide-react';

const Reportes: React.FC = () => {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [tipoReporte, setTipoReporte] = useState('ventas');

  const exportarPDF = () => {
    alert('🔄 Función de exportar a PDF en desarrollo');
  };

  const exportarExcel = () => {
    alert('🔄 Función de exportar a Excel en desarrollo');
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Reportes y Estadísticas</h1>
        <p className="text-gray-600">Genera reportes de ventas, productos y clientes</p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Generar Reporte</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Fecha Inicio</label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D4D45]"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Fecha Fin</label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D4D45]"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-2">Tipo de Reporte</label>
          <select
            value={tipoReporte}
            onChange={(e) => setTipoReporte(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D4D45]"
          >
            <option value="ventas">Ventas</option>
            <option value="productos">Productos</option>
            <option value="clientes">Clientes</option>
            <option value="pedidos">Pedidos</option>
          </select>
        </div>

        <div className="flex gap-4">
          <button
            onClick={exportarPDF}
            className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition font-bold"
          >
            <FileText size={20} />
            Exportar PDF
          </button>
          <button
            onClick={exportarExcel}
            className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-bold"
          >
            <Download size={20} />
            Exportar Excel
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-md p-8 text-white text-center">
        <FileText size={64} className="mx-auto mb-4 opacity-80" />
        <h3 className="text-2xl font-bold mb-2">Sistema de Reportes</h3>
        <p className="text-blue-100">
          Selecciona las fechas y el tipo de reporte para generar tu documento
        </p>
      </div>
    </div>
  );
};

export default Reportes;