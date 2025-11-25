import React from 'react';
import { Pizza, WHATSAPP_NUMBER } from '../types';
import { ShoppingCart } from 'lucide-react';
import { OrderService } from '../services/api';

interface PizzaCardProps {
  pizza: Pizza;
}

const PizzaCard: React.FC<PizzaCardProps> = ({ pizza }) => {
  
  const handleOrder = async () => {
    await OrderService.createOrder(pizza.name);
    
    const message = `Hola Mike's Oven Pizza, quisiera pedir: ${pizza.name} (S/. ${pizza.price.toFixed(2)})`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col h-full border border-gray-100 group">
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
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-extrabold text-[#1A1A1A] uppercase leading-tight">{pizza.name}</h3>
          <span className="text-lg font-bold text-[#D14B4B]">S/ {pizza.price.toFixed(2)}</span>
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