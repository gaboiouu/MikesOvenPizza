import React, { useState, useEffect } from 'react';
import { FileText, Download, Calendar } from 'lucide-react';
import * as XLSX from 'xlsx';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';

interface Pedido {
  pedidoId: number;
  total: number;
  estado: string;
  fechaPedido: string;
  usuario: { nombreCompleto: string; email: string };
}

interface Cliente {
  id: number;
  nombreCompleto: string;
  email: string;
  telefono: string;
  rol: string;
  puntos: number;
  fechaRegistro: string;
}

const Reportes: React.FC = () => {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [tipoReporte, setTipoReporte] = useState('ventas');
  const [loading, setLoading] = useState(false);
  const { notification, showToast, hideToast } = useToast();

  const fetchData = async (endpoint: string) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:8080${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) throw new Error('Error al cargar datos');
    return response.json();
  };

  const exportarExcel = async () => {
    setLoading(true);
    
    try {
      if (tipoReporte === 'todos') {
        await exportarTodosLosReportes();
        return;
      }

      let data: any[] = [];
      let nombreArchivo = '';

      switch (tipoReporte) {
        case 'ventas':
          const pedidos: Pedido[] = await fetchData('/pedidos/listar');
          const pedidosFiltrados = filtrarPorFechas(pedidos);
          
          data = pedidosFiltrados.map((p) => ({
            'ID Pedido': p.pedidoId,
            'Cliente': p.usuario?.nombreCompleto || 'N/A',
            'Email': p.usuario?.email || 'N/A',
            'Total': `S/ ${p.total.toFixed(2)}`,
            'Estado': p.estado,
            'Fecha': new Date(p.fechaPedido).toLocaleString('es-ES')
          }));
          nombreArchivo = `Ventas_${new Date().toISOString().split('T')[0]}.xlsx`;
          break;

        case 'clientes':
          const clientes: Cliente[] = await fetchData('/users');
          const clientesFiltrados = filtrarPorFechas(clientes, 'fechaRegistro');
          
          data = clientesFiltrados.map((c) => ({
            'ID': c.id,
            'Nombre': c.nombreCompleto,
            'Email': c.email,
            'Teléfono': c.telefono || 'N/A',
            'Rol': c.rol,
            'Puntos': c.puntos,
            'Fecha Registro': new Date(c.fechaRegistro).toLocaleDateString('es-ES')
          }));
          nombreArchivo = `Clientes_${new Date().toISOString().split('T')[0]}.xlsx`;
          break;

        case 'productos':
          const productos = await fetchData('/productos/listar');
          
          data = productos.map((p: any) => ({
            'ID': p.producto_id,
            'Nombre': p.nombre_producto,
            'Categoría': p.categoria,
            'Precio Personal': `S/ ${p.precio_personal}`,
            'Precio Grande': p.precio_grande ? `S/ ${p.precio_grande}` : 'N/A',
            'Stock': p.stock || 'N/A'
          }));
          nombreArchivo = `Productos_${new Date().toISOString().split('T')[0]}.xlsx`;
          break;

        case 'pedidos':
          const todosPedidos: Pedido[] = await fetchData('/pedidos/listar');
          const pedidosFiltradosCompleto = filtrarPorFechas(todosPedidos);
          
          data = pedidosFiltradosCompleto.map((p) => ({
            'ID': p.pedidoId,
            'Cliente': p.usuario?.nombreCompleto || 'N/A',
            'Email': p.usuario?.email || 'N/A',
            'Total': p.total,
            'Estado': p.estado,
            'Fecha': new Date(p.fechaPedido).toLocaleString('es-ES')
          }));
          nombreArchivo = `Pedidos_${new Date().toISOString().split('T')[0]}.xlsx`;
          break;
      }

      if (data.length === 0) {
        showToast('warning', '⚠️ No hay datos para exportar en el rango de fechas seleccionado');
        setLoading(false);
        return;
      }

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Reporte');

      XLSX.writeFile(wb, nombreArchivo);
      showToast('success', '✅ Reporte de Excel generado exitosamente');
      
    } catch (error) {
      console.error('Error:', error);
      showToast('error', '❌ Error al generar el reporte de Excel');
    } finally {
      setLoading(false);
    }
  };

  const exportarTodosLosReportes = async () => {
    try {
      const wb = XLSX.utils.book_new();

      const pedidos: Pedido[] = await fetchData('/pedidos/listar');
      const pedidosFiltrados = filtrarPorFechas(pedidos);
      
      const dataVentas = pedidosFiltrados.map((p) => ({
        'ID Pedido': p.pedidoId,
        'Cliente': p.usuario?.nombreCompleto || 'N/A',
        'Email': p.usuario?.email || 'N/A',
        'Total': p.total,
        'Estado': p.estado,
        'Fecha': new Date(p.fechaPedido).toLocaleString('es-ES')
      }));
      
      const wsVentas = XLSX.utils.json_to_sheet(dataVentas);
      XLSX.utils.book_append_sheet(wb, wsVentas, 'Ventas');

      // 👥 HOJA 2: CLIENTES
      const clientes: Cliente[] = await fetchData('/users');
      const clientesFiltrados = filtrarPorFechas(clientes, 'fechaRegistro');
      
      const dataClientes = clientesFiltrados.map((c) => ({
        'ID': c.id,
        'Nombre': c.nombreCompleto,
        'Email': c.email,
        'Teléfono': c.telefono || 'N/A',
        'Rol': c.rol,
        'Puntos': c.puntos,
        'Fecha Registro': new Date(c.fechaRegistro).toLocaleDateString('es-ES')
      }));
      
      const wsClientes = XLSX.utils.json_to_sheet(dataClientes);
      XLSX.utils.book_append_sheet(wb, wsClientes, 'Clientes');

      // 🍕 HOJA 3: PRODUCTOS
      const productos = await fetchData('/productos/listar');
      
      const dataProductos = productos.map((p: any) => ({
        'ID': p.producto_id,
        'Nombre': p.nombre_producto,
        'Categoría': p.categoria,
        'Precio Personal': p.precio_personal,
        'Precio Grande': p.precio_grande || 'N/A',
        'Stock': p.stock || 'N/A'
      }));
      
      const wsProductos = XLSX.utils.json_to_sheet(dataProductos);
      XLSX.utils.book_append_sheet(wb, wsProductos, 'Productos');

      const dataPedidos = pedidosFiltrados.map((p) => ({
        'ID': p.pedidoId,
        'Cliente': p.usuario?.nombreCompleto || 'N/A',
        'Email': p.usuario?.email || 'N/A',
        'Total': p.total,
        'Estado': p.estado,
        'Fecha': new Date(p.fechaPedido).toLocaleString('es-ES')
      }));
      
      const wsPedidos = XLSX.utils.json_to_sheet(dataPedidos);
      XLSX.utils.book_append_sheet(wb, wsPedidos, 'Pedidos');

      const totalVentas = pedidosFiltrados.reduce((sum, p) => sum + p.total, 0);
      const promedioVenta = pedidosFiltrados.length > 0 ? totalVentas / pedidosFiltrados.length : 0;
      
      const dataResumen = [
        { 'Métrica': 'Total de Pedidos', 'Valor': pedidosFiltrados.length },
        { 'Métrica': 'Total Vendido', 'Valor': `S/ ${totalVentas.toFixed(2)}` },
        { 'Métrica': 'Promedio por Pedido', 'Valor': `S/ ${promedioVenta.toFixed(2)}` },
        { 'Métrica': 'Total de Clientes', 'Valor': clientesFiltrados.length },
        { 'Métrica': 'Total de Productos', 'Valor': productos.length },
        { 'Métrica': 'Pedidos Pendientes', 'Valor': pedidosFiltrados.filter(p => p.estado === 'PENDIENTE').length },
        { 'Métrica': 'Pedidos Entregados', 'Valor': pedidosFiltrados.filter(p => p.estado === 'ENTREGADO').length },
        { 'Métrica': 'Período', 'Valor': `${fechaInicio || 'Inicio'} - ${fechaFin || 'Hoy'}` }
      ];
      
      const wsResumen = XLSX.utils.json_to_sheet(dataResumen);
      XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen General');

      const nombreArchivo = `Reporte_Completo_MikesPizza_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, nombreArchivo);
      
      showToast('success', '✅ Reporte completo generado exitosamente con 5 hojas');
      
    } catch (error) {
      console.error('Error:', error);
      showToast('error', '❌ Error al generar el reporte completo');
    } finally {
      setLoading(false);
    }
  };

  const exportarPDF = async () => {
    setLoading(true);
    
    try {
      if (tipoReporte === 'todos') {
        await exportarTodosPDF();
        return;
      }

      let data: any[] = [];
      let titulo = '';

      switch (tipoReporte) {
        case 'ventas':
          const pedidos: Pedido[] = await fetchData('/pedidos/listar');
          const pedidosFiltrados = filtrarPorFechas(pedidos);
          
          const totalVentas = pedidosFiltrados.reduce((sum, p) => sum + p.total, 0);
          const promedioVenta = pedidosFiltrados.length > 0 ? totalVentas / pedidosFiltrados.length : 0;
          
          titulo = 'REPORTE DE VENTAS';
          data = [
            `Total de Pedidos: ${pedidosFiltrados.length}`,
            `Total Vendido: S/ ${totalVentas.toFixed(2)}`,
            `Promedio por Pedido: S/ ${promedioVenta.toFixed(2)}`,
            `Período: ${fechaInicio || 'Inicio'} - ${fechaFin || 'Hoy'}`
          ];
          break;

        case 'clientes':
          const clientes: Cliente[] = await fetchData('/users');
          const clientesFiltrados = filtrarPorFechas(clientes, 'fechaRegistro');
          
          titulo = 'REPORTE DE CLIENTES';
          data = [
            `Total de Clientes: ${clientesFiltrados.length}`,
            `Clientes MASTER: ${clientesFiltrados.filter(c => c.rol === 'MASTER').length}`,
            `Clientes ADMIN: ${clientesFiltrados.filter(c => c.rol === 'ADMIN').length}`,
            `Clientes Regulares: ${clientesFiltrados.filter(c => c.rol === 'CLIENTE').length}`,
            `Período: ${fechaInicio || 'Inicio'} - ${fechaFin || 'Hoy'}`
          ];
          break;

        case 'productos':
          const productos = await fetchData('/productos/listar');
          titulo = 'REPORTE DE PRODUCTOS';
          data = [
            `Total de Productos: ${productos.length}`,
            `Categorías: ${new Set(productos.map((p: any) => p.categoria)).size}`
          ];
          break;

        case 'pedidos':
          const todosPedidos: Pedido[] = await fetchData('/pedidos/listar');
          const pedidosFiltradosCompleto = filtrarPorFechas(todosPedidos);
          
          titulo = 'REPORTE DE PEDIDOS';
          data = [
            `Total de Pedidos: ${pedidosFiltradosCompleto.length}`,
            `Pendientes: ${pedidosFiltradosCompleto.filter(p => p.estado === 'PENDIENTE').length}`,
            `Entregados: ${pedidosFiltradosCompleto.filter(p => p.estado === 'ENTREGADO').length}`,
            `Cancelados: ${pedidosFiltradosCompleto.filter(p => p.estado === 'CANCELADO').length}`,
            `Período: ${fechaInicio || 'Inicio'} - ${fechaFin || 'Hoy'}`
          ];
          break;
      }

      generarPDFSimple(titulo, data);
      showToast('success', '✅ Reporte PDF generado exitosamente');
      
    } catch (error) {
      console.error('Error:', error);
      showToast('error', '❌ Error al generar el reporte PDF');
    } finally {
      setLoading(false);
    }
  };

  const exportarTodosPDF = async () => {
    try {
      const pedidos: Pedido[] = await fetchData('/pedidos/listar');
      const pedidosFiltrados = filtrarPorFechas(pedidos);
      const clientes: Cliente[] = await fetchData('/users');
      const clientesFiltrados = filtrarPorFechas(clientes, 'fechaRegistro');
      const productos = await fetchData('/productos/listar');

      const totalVentas = pedidosFiltrados.reduce((sum, p) => sum + p.total, 0);
      const promedioVenta = pedidosFiltrados.length > 0 ? totalVentas / pedidosFiltrados.length : 0;

      const data = [
        '<h2>📊 VENTAS</h2>',
        `Total de Pedidos: ${pedidosFiltrados.length}`,
        `Total Vendido: S/ ${totalVentas.toFixed(2)}`,
        `Promedio por Pedido: S/ ${promedioVenta.toFixed(2)}`,
        '',
        '<h2>👥 CLIENTES</h2>',
        `Total de Clientes: ${clientesFiltrados.length}`,
        `Clientes MASTER: ${clientesFiltrados.filter(c => c.rol === 'MASTER').length}`,
        `Clientes ADMIN: ${clientesFiltrados.filter(c => c.rol === 'ADMIN').length}`,
        `Clientes Regulares: ${clientesFiltrados.filter(c => c.rol === 'CLIENTE').length}`,
        '',
        '<h2>🍕 PRODUCTOS</h2>',
        `Total de Productos: ${productos.length}`,
        `Categorías: ${new Set(productos.map((p: any) => p.categoria)).size}`,
        '',
        '<h2>📦 PEDIDOS</h2>',
        `Pendientes: ${pedidosFiltrados.filter(p => p.estado === 'PENDIENTE').length}`,
        `Entregados: ${pedidosFiltrados.filter(p => p.estado === 'ENTREGADO').length}`,
        `Cancelados: ${pedidosFiltrados.filter(p => p.estado === 'CANCELADO').length}`,
        '',
        `Período: ${fechaInicio || 'Inicio'} - ${fechaFin || 'Hoy'}`
      ];

      generarPDFSimple('REPORTE COMPLETO - MIKE\'S OVEN PIZZA', data);
      showToast('success', '✅ Reporte completo PDF generado exitosamente');
      
    } catch (error) {
      console.error('Error:', error);
      showToast('error', '❌ Error al generar el reporte completo PDF');
    } finally {
      setLoading(false);
    }
  };

  const generarPDFSimple = (titulo: string, datos: string[]) => {
    const ventana = window.open('', '_blank');
    if (!ventana) return;

    ventana.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${titulo}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            h1 { color: #0D4D45; text-align: center; margin-bottom: 30px; }
            h2 { color: #0D4D45; margin-top: 25px; margin-bottom: 15px; border-bottom: 2px solid #0D4D45; padding-bottom: 5px; }
            .info { font-size: 16px; line-height: 2; }
            .info p { margin: 10px 0; padding: 10px; background: #f5f5f5; border-left: 4px solid #D14B4B; }
            .footer { text-align: center; margin-top: 40px; color: #666; }
          </style>
        </head>
        <body>
          <h1>🍕 ${titulo}</h1>
          <div class="info">
            ${datos.map(d => d.startsWith('<h2>') ? d : `<p>${d}</p>`).join('')}
          </div>
          <div class="footer">
            <p>Generado el ${new Date().toLocaleString('es-ES')}</p>
            <p><strong>Mike's Oven Pizza</strong></p>
          </div>
        </body>
      </html>
    `);

    setTimeout(() => {
      ventana.print();
      ventana.close();
    }, 500);
  };

  const filtrarPorFechas = (data: any[], campoFecha: string = 'fechaPedido') => {
    if (!fechaInicio && !fechaFin) return data;

    return data.filter((item) => {
      const fecha = new Date(item[campoFecha]);
      const inicio = fechaInicio ? new Date(fechaInicio) : new Date('1900-01-01');
      const fin = fechaFin ? new Date(fechaFin) : new Date();

      return fecha >= inicio && fecha <= fin;
    });
  };

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
            <option value="ventas">📊 Ventas</option>
            <option value="productos">🍕 Productos</option>
            <option value="clientes">👥 Clientes</option>
            <option value="pedidos">📦 Pedidos</option>
            <option value="todos">📋 Todos los Reportes</option>
          </select>
        </div>

        <div className="flex gap-4">
          <button
            onClick={exportarPDF}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition font-bold disabled:opacity-50"
          >
            <FileText size={20} />
            {loading ? 'Generando...' : 'Exportar PDF'}
          </button>
          <button
            onClick={exportarExcel}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-bold disabled:opacity-50"
          >
            <Download size={20} />
            {loading ? 'Generando...' : 'Exportar Excel'}
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-md p-8 text-white text-center">
        <FileText size={64} className="mx-auto mb-4 opacity-80" />
        <h3 className="text-2xl font-bold mb-2">Sistema de Reportes</h3>
        <p className="text-blue-100">
          Selecciona las fechas y el tipo de reporte para generar tu documento
        </p>
        {tipoReporte === 'todos' && (
          <p className="text-yellow-200 mt-3 font-semibold">
            ⚡ Modo Completo: Generará un archivo con todos los reportes en múltiples hojas
          </p>
        )}
      </div>
    </div>
  );
};

export default Reportes;