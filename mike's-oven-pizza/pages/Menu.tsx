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
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.rol === 'ADMIN' || user.rol === 'MASTER';
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8080/productos/listar')
      .then(res => res.json())
      .then(data => {
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
      });
  }, []);

  const filteredProductos = productos.filter(p =>
    (filter === 'Todos' || p.category === filter) &&
    (search === '' || p.name.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Seguro que deseas eliminar este producto?')) {
      await fetch(`http://localhost:8080/productos/eliminar/${id}`, { method: 'DELETE' });
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
      <div className="bg-[#1A1A1A] text-white py-12 mb-8">
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
          <div className="mb-8 flex justify-end">
            <motion.button
              className="bg-[#0D4D45] text-white px-6 py-2 rounded font-bold shadow hover:bg-[#D14B4B] transition transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/admin-product')}
            >
              Agregar Producto
            </motion.button>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 mb-12 items-center justify-between">
          <div>
            <label className="font-bold mr-2">Filtrar por categoría:</label>
            <select
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="px-4 py-2 rounded border font-bold bg-white text-[#0D4D45] focus:ring-2 focus:ring-[#0D4D45] focus:border-[#0D4D45] transition"
              style={{ color: '#0D4D45' }}
            >
              {categorias.map(cat => (
                <option key={cat} value={cat} style={{ color: '#0D4D45' }}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <input
              type="text"
              placeholder="Buscar producto..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="px-4 py-2 rounded border border-gray-300 font-bold transition focus:ring-2 focus:ring-[#0D4D45] focus:border-[#0D4D45]"
            />
          </div>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {filteredProductos.map(pizza => (
            <motion.div
              key={pizza.id}
              className="relative"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <PizzaCard
                pizza={pizza}
                isAdmin={isAdmin}
                onDelete={() => handleDelete(pizza.id)}
                onUpdate={() => handleUpdate(pizza.id)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Menu;
