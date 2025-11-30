import React, { useState, useEffect } from 'react';
import { Pizza, WHATSAPP_NUMBER } from '../types';
import { ShoppingCart, Trash2, Pencil, Heart, Plus } from 'lucide-react';

interface PizzaCardProps {
  pizza: Pizza;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string) => void;
}

const PizzaCard: React.FC<PizzaCardProps> = ({ pizza, isAdmin = false, onDelete, onUpdate }) => {
  const [isFavorito, setIsFavorito] = useState(false);
  const [showSizeModal, setShowSizeModal] = useState(false);

  useEffect(() => {
    // Verificar si el producto está en favoritos
    const favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
    setIsFavorito(favoritos.some((fav: any) => fav.id === pizza.id));
  }, [pizza.id]);

  const toggleFavorito = () => {
    const favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
    let newFavoritos;
    
    if (isFavorito) {
      newFavoritos = favoritos.filter((fav: any) => fav.id !== pizza.id);
    } else {
      newFavoritos = [...favoritos, pizza];
    }
    
    localStorage.setItem('favoritos', JSON.stringify(newFavoritos));
    setIsFavorito(!isFavorito);
  };

  const addToCart = (size: 'Personal' | 'Grande') => {
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
    setShowSizeModal(false);
    
    // Mostrar notificación
    alert(`✅ ${pizza.name} (${size}) agregado al carrito`);
  };

  const handleAddToCart = () => {
    if (pizza.priceGrande) {
      setShowSizeModal(true);
    } else {
      addToCart('Personal');
    }
  };

  const handleOrder = () => {
    const message = `Hola Mike's Oven Pizza, quisiera pedir: ${pizza.name} (Personal S/. ${pizza.price.toFixed(2)}${pizza.priceGrande ? `, Grande S/. ${pizza.priceGrande.toFixed(2)}` : ''})`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <>
      <div className="bg-white rounded-xl overflow-hidden shadow-md flex flex-col h-full border border-gray-100 group relative">
        {/* Botón de Favorito */}
        <button
          onClick={toggleFavorito}
          className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all hover:scale-110"
        >
          <Heart 
            size={20} 
            className={isFavorito ? 'fill-[#D14B4B] text-[#D14B4B]' : 'text-gray-400 hover:text-[#D14B4B]'}
          />
        </button>

        <div className="relative overflow-hidden h-56">
          <img 
            src={pizza.imageUrl} 
            alt={pizza.name} 
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-4 left-4 bg-[#FF8F3A] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm">
            {pizza.category}
          </div>
        </div>

        <div className="p-6 flex flex-col flex-grow">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-extrabold text-[#1A1A1A] uppercase leading-tight">{pizza.name}</h3>
            {isAdmin && (
              <div className="flex gap-2">
                <button
                  className="bg-[#D14B4B] hover:bg-red-700 text-white p-2 rounded-full shadow transition"
                  title="Eliminar"
                  onClick={onDelete}
                >
                  <Trash2 size={20} />
                </button>
                <button
                  className="bg-[#0D4D45] hover:bg-[#145C54] text-white p-2 rounded-full shadow transition"
                  title="Actualizar"
                  onClick={onUpdate}
                >
                  <Pencil size={20} />
                </button>
              </div>
            )}
          </div>

          <div className="mt-1 font-bold text-[#D14B4B] text-base">
            Personal: S/ {pizza.price.toFixed(2)}
            {pizza.priceGrande && (
              <span className="ml-4">Grande: S/ {pizza.priceGrande.toFixed(2)}</span>
            )}
          </div>

          <p className="text-gray-500 text-sm mb-6 flex-grow leading-relaxed">
            {pizza.description}
          </p>

          <div className="flex gap-2">
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-[#0D4D45] hover:bg-[#08332e] text-white font-bold py-3 rounded-lg uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <Plus size={18} />
              Agregar
            </button>
            <button 
              onClick={handleOrder}
              className="flex-1 bg-[#D14B4B] hover:bg-red-700 text-white font-bold py-3 rounded-lg uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <ShoppingCart size={18} />
              Pedir
            </button>
          </div>
        </div>
      </div>

      {showSizeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-[#1A1A1A] mb-4">Selecciona el tamaño</h3>
            <p className="text-gray-600 mb-6">{pizza.name}</p>
            
            <div className="space-y-3">
              <button
                onClick={() => addToCart('Personal')}
                className="w-full bg-[#0D4D45] hover:bg-[#08332e] text-white p-4 rounded-lg font-bold flex justify-between items-center transition"
              >
                <span>Personal</span>
                <span>S/ {pizza.price.toFixed(2)}</span>
              </button>
              
              {pizza.priceGrande && (
                <button
                  onClick={() => addToCart('Grande')}
                  className="w-full bg-[#D14B4B] hover:bg-red-700 text-white p-4 rounded-lg font-bold flex justify-between items-center transition"
                >
                  <span>Grande</span>
                  <span>S/ {pizza.priceGrande.toFixed(2)}</span>
                </button>
              )}
            </div>

            <button
              onClick={() => setShowSizeModal(false)}
              className="w-full mt-4 bg-gray-200 hover:bg-gray-300 text-gray-700 p-3 rounded-lg font-bold transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PizzaCard;