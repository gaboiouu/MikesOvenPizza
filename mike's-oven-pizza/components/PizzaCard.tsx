import React from 'react';
import { Pizza, WHATSAPP_NUMBER } from '../types';
import { ShoppingCart, Trash2, Pencil } from 'lucide-react';

interface PizzaCardProps {
  pizza: Pizza;
  isAdmin: boolean;
  onDelete: (id: string) => void;
  onUpdate: (id: string) => void;
}

const PizzaCard: React.FC<PizzaCardProps> = ({ pizza, isAdmin, onDelete, onUpdate }) => {
  const handleOrder = () => {
    const message = `Hola Mike's Oven Pizza, quisiera pedir: ${pizza.name} (Personal S/. ${pizza.price.toFixed(2)}${pizza.priceGrande ? `, Grande S/. ${pizza.priceGrande.toFixed(2)}` : ''})`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md flex flex-col h-full border border-gray-100 group">
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
        <button 
          onClick={handleOrder}
          className="w-full bg-[#D14B4B] hover:bg-red-700 text-white font-bold py-3 rounded-lg uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
        >
          <ShoppingCart size={18} />
          Pedir por WhatsApp
        </button>
      </div>
    </div>
  );
};

export default PizzaCard;