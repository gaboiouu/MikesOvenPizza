import React from 'react';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1A1A1A] text-[#F3E3C2] pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-[#FF8F3A]">MIKE'S OVEN PIZZA</h3>
            <p className="text-gray-400 text-sm">
              La auténtica pizza artesanal hecha con pasión y los mejores ingredientes. Sabor que conecta.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4 text-white border-b-2 border-[#D14B4B] inline-block pb-1">Enlaces</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#/menu" className="hover:text-[#FF8F3A]">Menú</a></li>
              <li><a href="#/reservas" className="hover:text-[#FF8F3A]">Reservas</a></li>
              <li><a href="#/about" className="hover:text-[#FF8F3A]">Nosotros</a></li>
              <li><a href="#/admin" className="hover:text-[#FF8F3A]">Intranet</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4 text-white border-b-2 border-[#D14B4B] inline-block pb-1">Contacto</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-[#D14B4B]" /> Av. Gastronomía 123, Lima
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-[#D14B4B]" /> +51 999 999 999
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-[#D14B4B]" /> contacto@mikespizza.com
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4 text-white border-b-2 border-[#D14B4B] inline-block pb-1">Síguenos</h4>
            <div className="flex space-x-4">
              <a href="#" className="bg-[#333] p-2 rounded-full hover:bg-[#D14B4B] transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="bg-[#333] p-2 rounded-full hover:bg-[#D14B4B] transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="bg-[#333] p-2 rounded-full hover:bg-[#D14B4B] transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Mike's Oven Pizza. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;