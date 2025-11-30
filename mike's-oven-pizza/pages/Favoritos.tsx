import React, { useState, useEffect } from 'react';
import { Heart, ArrowLeft, ShoppingCart, Plus } from 'lucide-react';
import { Pizza } from '../types';

const Favoritos: React.FC = () => {
  const [favoritos, setFavoritos] = useState<Pizza[]>([]);

  useEffect(() => {
    const savedFavoritos = localStorage.getItem('favoritos');
    if (savedFavoritos) {
      setFavoritos(JSON.parse(savedFavoritos));
    }
  }, []);

  const removeFavorito = (id: number) => {
    const newFavoritos = favoritos.filter(fav => fav.id !== id);
    setFavoritos(newFavoritos);
    localStorage.setItem('favoritos', JSON.stringify(newFavoritos));
  };

  const addToCart = (pizza: Pizza, size: 'Personal' | 'Grande') => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const precio = size === 'Personal' ? pizza.price : (pizza.priceGrande || pizza.price);
    
    const newItem = {
      id: pizza.id,
      name: pizza.name,
      precio: precio,
      size: size,
      imageUrl: pizza.imageUrl,
      cantidad: 1
    };
    
    cart.push(newItem);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`✅ ${pizza.name} (${size}) agregado al carrito`);
  };

  return (
    <div className="min-h-screen bg-[#F3E3C2]/20 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-[#D14B4B] rounded-2xl p-6 mb-8 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => window.history.back()}
                className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition"
              >
                <ArrowLeft size={24} className="text-white" />
              </button>
              <div>
                <h1 className="text-3xl font-extrabold text-white uppercase tracking-wider">
                  Mis Favoritos
                </h1>
                <p className="text-white/80 mt-1">
                  {favoritos.length} {favoritos.length === 1 ? 'producto' : 'productos'}
                </p>
              </div>
            </div>
            <Heart size={48} className="text-white fill-white" />
          </div>
        </div>

        {favoritos.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
            <Heart size={80} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">
              No tienes favoritos aún
            </h2>
            <p className="text-gray-500 mb-6">
              Guarda tus pizzas favoritas para encontrarlas fácilmente
            </p>
            <button
              onClick={() => window.location.href = '#/menu'}
              className="bg-[#D14B4B] hover:bg-red-700 text-white px-8 py-3 rounded-lg font-bold uppercase tracking-wider transition"
            >
              Explorar Menú
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoritos.map((pizza) => (
              <div key={pizza.id} className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition group">
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={pizza.imageUrl} 
                    alt={pizza.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <button
                    onClick={() => removeFavorito(pizza.id)}
                    className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition z-10"
                  >
                    <Heart size={20} className="fill-[#D14B4B] text-[#D14B4B]" />
                  </button>
                  <div className="absolute top-4 left-4 bg-[#FF8F3A] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm">
                    {pizza.category}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-extrabold text-[#1A1A1A] uppercase mb-2">
                    {pizza.name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                    {pizza.description}
                  </p>
                  
                  <div className="mb-4">
                    <div className="font-bold text-[#D14B4B] text-base">
                      Personal: S/ {pizza.price.toFixed(2)}
                    </div>
                    {pizza.priceGrande && (
                      <div className="font-bold text-[#D14B4B] text-base">
                        Grande: S/ {pizza.priceGrande.toFixed(2)}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {pizza.priceGrande ? (
                      <>
                        <button
                          onClick={() => addToCart(pizza, 'Personal')}
                          className="flex-1 bg-[#0D4D45] hover:bg-[#08332e] text-white font-bold py-2 px-3 rounded-lg text-sm uppercase flex items-center justify-center gap-1 transition"
                        >
                          <Plus size={16} /> Personal
                        </button>
                        <button
                          onClick={() => addToCart(pizza, 'Grande')}
                          className="flex-1 bg-[#D14B4B] hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg text-sm uppercase flex items-center justify-center gap-1 transition"
                        >
                          <Plus size={16} /> Grande
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => addToCart(pizza, 'Personal')}
                        className="w-full bg-[#0D4D45] hover:bg-[#08332e] text-white font-bold py-2 rounded-lg uppercase flex items-center justify-center gap-2 transition"
                      >
                        <ShoppingCart size={18} /> Agregar al Carrito
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favoritos;