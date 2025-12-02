import React, { useEffect, useState } from 'react';
import PizzaCard from '../components/PizzaCard';
import { Pizza } from '../types';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; 

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

const Menu: React.FC = () => {
  const [productos, setProductos] = useState<Pizza[]>([]);
  const [filter, setFilter] = useState<string>('Todos');
  const [search, setSearch] = useState<string>('');
  
  const userRole = localStorage.getItem('rol');
  const isAdmin = userRole === 'ADMIN' || userRole === 'MASTER';
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const token = localStorage.getItem('token');
        
        const response = await fetch('http://localhost:8080/productos/listar', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
          }
        });

        if (response.ok) {
          const data = await response.json();
          const mapped = data.map((p: any) => ({
            id: p.producto_id,
            name: p.nombre_producto,
            description: p.ingredientes,
            price: p.precio_personal,
            priceGrande: p.precio_grande,
            imageUrl: p.imagen_url,
            category: p.categoria.replace(/_/g, ' ')
          }));
          setProductos(mapped);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchProductos();
  }, []);

  const filteredProductos = productos.filter(p =>
    (filter === 'Todos' || p.category === filter) &&
    (search === '' || p.name.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Seguro que deseas eliminar este producto?')) {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:8080/productos/eliminar/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      setProductos(productos.filter(p => p.id !== id));
    }
  };

  const handleUpdate = (id: number) => {
    navigate(`/admin-product?id=${id}`);
  };

  return (
    <motion.div
      className="bg-gray-50 min-h-screen pb-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

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

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-slideInDown {
          animation: slideInDown 0.5s ease-out;
        }

        .animate-popIn {
          animation: popIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
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
        .product-card-float:nth-child(13) { animation-delay: 0.65s; }
        .product-card-float:nth-child(14) { animation-delay: 0.7s; }
        .product-card-float:nth-child(15) { animation-delay: 0.75s; }

        .card-hover {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .card-hover:hover {
          transform: translateY(-12px) scale(1.02);
          box-shadow: 0 20px 50px rgba(13, 77, 69, 0.2);
        }

        .button-float {
          animation: float 3s ease-in-out infinite;
        }

        .button-hover {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .button-hover:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(13, 77, 69, 0.3);
        }

        .filter-transition {
          transition: all 0.3s ease;
        }
      `}</style>

      <div className="bg-[#1A1A1A] text-white py-12 mb-8 animate-slideInDown">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h1
            className="text-4xl md:text-5xl font-extrabold uppercase"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Nuestra Carta
          </motion.h1>
          <motion.p
            className="text-gray-400 mt-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Sabores auténticos, directo del horno de leña.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {isAdmin && (
          <div className="mb-8 flex justify-end animate-popIn">
            <motion.button
              className="bg-[#0D4D45] text-white px-6 py-3 rounded font-bold shadow-lg hover:bg-[#08332e] transition-all duration-300 button-hover button-float"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/admin-product')}
            >
              ➕ Agregar Producto
            </motion.button>
          </div>
        )}

        <motion.div
          className="flex flex-col md:flex-row gap-4 mb-12 items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-200 animate-popIn"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="w-full md:w-auto filter-transition">
            <label className="font-bold mr-2 text-gray-700">Filtrar por categoría:</label>
            <select
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="px-4 py-2 rounded border-2 border-gray-300 font-bold bg-white text-[#0D4D45] focus:ring-2 focus:ring-[#0D4D45] focus:border-[#0D4D45] transition hover:border-[#0D4D45] cursor-pointer hover:shadow-md"
              style={{ color: '#0D4D45' }}
            >
              {categorias.map(cat => (
                <option key={cat} value={cat} style={{ color: '#0D4D45' }}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full md:w-auto">
            <input
              type="text"
              placeholder="🔍 Buscar producto..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full md:w-64 px-4 py-2 rounded border-2 border-gray-300 font-bold transition-all duration-300 focus:ring-2 focus:ring-[#0D4D45] focus:border-[#0D4D45] hover:border-[#0D4D45] placeholder-gray-500"
            />
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
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
          {filteredProductos.map((pizza, idx) => (
            <div
              key={pizza.id}
              className="relative product-card-float card-hover"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <PizzaCard
                  pizza={pizza}
                  isAdmin={isAdmin}
                  onDelete={() => handleDelete(pizza.id)}
                  onUpdate={() => handleUpdate(pizza.id)}
                />
              </motion.div>
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
              😕 No encontramos productos en esta categoría
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Menu;
