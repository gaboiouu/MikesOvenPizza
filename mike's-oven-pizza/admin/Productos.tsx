import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';

interface Producto {
  producto_id: number;
  nombre_producto: string;
  categoria: string;
  precio_personal: number;
  precio_grande: number;
  imagen_url: string;
}

const Productos: React.FC = () => {
  const { notification, showToast, hideToast } = useToast();
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
      const response = await fetch('http://localhost:8080/productos/listar-paginado?page=0&size=1000&sort=nombre_producto,asc');
      
      if (response.ok) {
        const data = await response.json();
        setProductos(data.content || data);
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
      showToast('success', '✅ Producto eliminado correctamente');
    } catch (error) {
      console.error('Error:', error);
      showToast('error', '❌ Error al eliminar producto');
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
    <motion.div className="bg-gray-50 min-h-screen pb-24">
      {notification && (
        <Toast
          type={notification.type}
          message={notification.message}
          onClose={hideToast}
        />
      )}
      
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes popIn {
          0% {
            opacity: 0;
            transform: scale(0.85) rotateY(90deg);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotateY(0deg);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .product-card-float {
          animation: popIn 0.6s ease-out backwards;
        }

        .product-card-float:nth-child(1) { animation-delay: 0.05s; }
        .product-card-float:nth-child(2) { animation-delay: 0.1s; }
        .product-card-float:nth-child(3) { animation-delay: 0.15s; }
        .product-card-float:nth-child(4) { animation-delay: 0.2s; }
        .product-card-float:nth-child(5) { animation-delay: 0.25s; }
        .product-card-float:nth-child(6) { animation-delay: 0.3s; }
        .product-card-float:nth-child(7) { animation-delay: 0.35s; }
        .product-card-float:nth-child(8) { animation-delay: 0.4s; }
        .product-card-float:nth-child(9) { animation-delay: 0.45s; }
        .product-card-float:nth-child(10) { animation-delay: 0.5s; }
        .product-card-float:nth-child(11) { animation-delay: 0.55s; }
        .product-card-float:nth-child(12) { animation-delay: 0.6s; }

        .card-hover {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .card-hover:hover {
          transform: translateY(-12px) scale(1.02);
          box-shadow: 0 20px 50px rgba(13, 77, 69, 0.2);
        }
      `}</style>

      {/* 🔥 NUEVA CABECERA CON BOTÓN A LA DERECHA */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <motion.h1
            className="text-3xl font-bold text-gray-800 mb-2"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Gestión de Productos
          </motion.h1>

          <motion.p
            className="text-gray-600"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Total de productos: {productos.length}
          </motion.p>
        </div>

        <motion.button
          onClick={() => navigate('/admin-product')}
          className="animate-float flex items-center gap-2 bg-[#0D4D45] hover:bg-[#08332e] text-white px-5 py-3 rounded-lg font-bold shadow-lg transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={20} />
          <span className="hidden md:block">Agregar Producto</span>
        </motion.button>
      </div>

      <motion.div
        className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D4D45] focus:border-[#0D4D45] font-bold text-[#0D4D45] transition hover:border-[#0D4D45] cursor-pointer"
        >
          {categorias.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.05
            }
          }
        }}
      >
        {filteredProductos.map((producto) => (
          <div
            key={producto.producto_id}
            className="product-card-float card-hover bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all"
          >
            <div className="relative overflow-hidden h-56">
              <img
                src={producto.imagen_url}
                alt={producto.nombre_producto}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-[#FF8F3A] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm">
                {producto.categoria.replace(/_/g, ' ')}
              </div>
            </div>
            
            <div className="p-5">
              <h3 className="font-extrabold text-xl text-[#1A1A1A] uppercase mb-2 leading-tight">
                {producto.nombre_producto}
              </h3>
              
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Personal</p>
                  <p className="text-lg font-bold text-[#D14B4B]">
                    S/ {producto.precio_personal.toFixed(2)}
                  </p>
                </div>
                {producto.precio_grande && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Grande</p>
                    <p className="text-lg font-bold text-[#D14B4B]">
                      S/ {producto.precio_grande.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/admin-product?id=${producto.producto_id}`)}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#0D4D45] hover:bg-[#08332e] text-white px-4 py-3 rounded-lg font-bold transition-all hover:shadow-lg"
                >
                  <Edit size={16} />
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(producto.producto_id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#D14B4B] hover:bg-red-700 text-white px-4 py-3 rounded-lg font-bold transition-all hover:shadow-lg"
                >
                  <Trash2 size={16} />
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {filteredProductos.length === 0 && (
        <motion.div
          className="text-center py-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-gray-600 text-lg font-semibold">
            😕 No se encontraron productos en esta categoría
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Productos;
