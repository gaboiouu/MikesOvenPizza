import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Package } from 'lucide-react';

interface Producto {
  producto_id: number;
  nombre_producto: string;
  categoria: string;
  precio_personal: number;
  precio_grande: number;
  imagen_url: string;
}

const Productos: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Todos');
  const navigate = useNavigate();

  const categorias = [
    'Todos',
    'PIZZAS CLASICAS',
    'PIZZAS ESPECIALES',
    'PIZZAS DULCES',
    'CALZONE Y PAN AL AJO',
    'EXTRAS',
    'PASTAS PLATOS',
    'ALITAS',
    'COMPLEMENTOS',
    'POSTRES',
    'BEBIDAS',
    'TRAGOS',
    'PARA COMPARTIR'
  ];

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await fetch('http://localhost:8080/productos/listar');
      if (response.ok) {
        const data = await response.json();
        setProductos(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Seguro que deseas eliminar este producto?')) return;

    const token = localStorage.getItem('token');
    try {
      await fetch(`http://localhost:8080/productos/eliminar/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setProductos(productos.filter(p => p.producto_id !== id));
      alert('✅ Producto eliminado');
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al eliminar producto');
    }
  };

  const filteredProductos = filter === 'Todos'
    ? productos
    : productos.filter(p => p.categoria === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#D14B4B]"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestión de Productos</h1>
          <p className="text-gray-600">Total de productos: {productos.length}</p>
        </div>
        <button
          onClick={() => navigate('/admin-product')}
          className="flex items-center gap-2 bg-[#D14B4B] text-white px-6 py-3 rounded-lg hover:bg-red-700 transition font-bold"
        >
          <Plus size={20} />
          Agregar Producto
        </button>
      </div>

      <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D4D45]"
        >
          {categorias.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProductos.map((producto) => (
          <div key={producto.producto_id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
            <img
              src={producto.imagen_url}
              alt={producto.nombre_producto}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-800 mb-2">{producto.nombre_producto}</h3>
              <p className="text-sm text-gray-600 mb-2">{producto.categoria.replace(/_/g, ' ')}</p>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-gray-500">Personal:</p>
                  <p className="text-lg font-bold text-[#D14B4B]">S/ {producto.precio_personal}</p>
                </div>
                {producto.precio_grande && (
                  <div>
                    <p className="text-sm text-gray-500">Grande:</p>
                    <p className="text-lg font-bold text-[#D14B4B]">S/ {producto.precio_grande}</p>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/admin-product?id=${producto.producto_id}`)}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  <Edit size={16} />
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(producto.producto_id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  <Trash2 size={16} />
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProductos.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          No se encontraron productos en esta categoría.
        </div>
      )}
    </div>
  );
};

export default Productos;