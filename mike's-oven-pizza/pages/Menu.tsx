import React, { useEffect, useState } from 'react';
import { PizzaService } from '../services/api';
import { Pizza } from '../types';
import PizzaCard from '../components/PizzaCard';

const Menu: React.FC = () => {
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [filter, setFilter] = useState<string>('Todos');
  
  const categories = [
    'Todos', 
    'Clásicas', 
    'Especiales', 
    'Dulces', 
    'Pastas & Platos', 
    'Entradas & Calzone', 
    'Postres', 
    'Bebidas'
  ];

  useEffect(() => {
    const loadMenu = async () => {
      const data = await PizzaService.getAll();
      setPizzas(data);
    };
    loadMenu();
  }, []);

  const filteredPizzas = filter === 'Todos' 
    ? pizzas 
    : pizzas.filter(p => p.category === filter || (filter === 'Entradas & Calzone' && (p.category === 'Entradas & Calzone')));

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-[#1A1A1A] text-white py-12 mb-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold uppercase">Nuestra Carta</h1>
          <p className="text-gray-400 mt-2">Sabores auténticos, directo del horno de leña.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full font-bold uppercase tracking-wide transition-all ${
                filter === cat 
                ? 'bg-[#D14B4B] text-white shadow-lg transform scale-105' 
                : 'bg-white text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPizzas.map(pizza => (
            <PizzaCard key={pizza.id} pizza={pizza} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Menu;