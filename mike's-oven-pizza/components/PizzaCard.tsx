import React, { useState, useEffect } from 'react';
import { Pizza, WHATSAPP_NUMBER } from '../types';
import { ShoppingCart, Trash2, Pencil, Heart, Plus, CheckCircle, XCircle } from 'lucide-react';

interface PizzaCardProps {
  pizza: Pizza;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string) => void;
}

const PizzaCard: React.FC<PizzaCardProps> = ({ pizza, isAdmin = false, onDelete, onUpdate }) => {
  const [isFavorito, setIsFavorito] = useState(false);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showDetallesModal, setShowDetallesModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState<'Personal' | 'Grande' | null>(null);
  
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');

  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'warning', message: string } | null>(null);

  useEffect(() => {
    const favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
    setIsFavorito(favoritos.some((fav: any) => fav.id === pizza.id));
  }, [pizza.id]);

  const showNotification = (type: 'success' | 'error' | 'warning', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

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
    
    showNotification('success', `${pizza.name} (${size}) agregado al carrito`);
  };

  const handleAddToCart = () => {
    if (pizza.priceGrande) {
      setShowSizeModal(true);
    } else {
      addToCart('Personal');
    }
  };

  const handleOrder = () => {
    setShowOrderModal(true);
  };

  const seleccionarTamanio = (size: 'Personal' | 'Grande') => {
    setSelectedSize(size);
    setShowOrderModal(false);
    setShowDetallesModal(true);
  };

  const confirmarPedido = async () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      showNotification('warning', 'Debes iniciar sesión para realizar un pedido');
      setShowDetallesModal(false);
      return;
    }

    if (!direccion.trim() || !telefono.trim()) {
      showNotification('warning', 'Por favor completa dirección y teléfono');
      return;
    }

    if (!selectedSize) {
      showNotification('error', 'Error: No se seleccionó tamaño');
      return;
    }

    const precio = selectedSize === 'Personal' ? pizza.price : (pizza.priceGrande || pizza.price);

    const pedidoData = {
      userId: parseInt(userId),
      estado: "PENDIENTE",
      total: precio,
      direccionEntrega: direccion, 
      telefonoContacto: telefono,  
      detalles: [
        {
          productoId: pizza.id,
          nombreProducto: pizza.name,
          cantidad: 1,
          precioUnitario: precio,
          subtotal: precio,
          tamanio: selectedSize
        }
      ]
    };

    try {
      console.log('📤 Enviando pedido:', pedidoData);

      const response = await fetch('http://localhost:8080/pedidos/crear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(pedidoData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error del servidor:', errorText);
        throw new Error('Error al crear el pedido');
      }

      const pedidoCreado = await response.json();
      console.log('✅ Pedido creado:', pedidoCreado);

      const message = `Hola Mike's Oven Pizza, acabo de realizar el pedido #${pedidoCreado.id}:\n\n${pizza.name} (${selectedSize}) - S/. ${precio.toFixed(2)}\n\nDirección: ${direccion}\nTeléfono: ${telefono}\n\nTotal: S/. ${precio.toFixed(2)}`;
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      
      setShowDetallesModal(false);
      setDireccion('');
      setTelefono('');
      setSelectedSize(null);
      
      showNotification('success', `Pedido #${pedidoCreado.id} registrado exitosamente`);
      
      setTimeout(() => {
        window.open(url, '_blank');
      }, 1500);

    } catch (error) {
      console.error('❌ Error al crear pedido:', error);
      showNotification('error', 'Error al crear el pedido. Intenta nuevamente.');
      setShowDetallesModal(false);
    }
  };

  return (
    <>
      {notification && (
        <div className="fixed top-4 right-4 z-[9999] animate-slideInRight">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-2xl border-l-4 ${
            notification.type === 'success' 
              ? 'bg-green-50 border-green-500' 
              : notification.type === 'error'
              ? 'bg-red-50 border-red-500'
              : 'bg-yellow-50 border-yellow-500'
          }`}>
            {notification.type === 'success' && <CheckCircle className="text-green-500" size={24} />}
            {notification.type === 'error' && <XCircle className="text-red-500" size={24} />}
            {notification.type === 'warning' && <XCircle className="text-yellow-500" size={24} />}
            <p className={`font-semibold ${
              notification.type === 'success' 
                ? 'text-green-800' 
                : notification.type === 'error'
                ? 'text-red-800'
                : 'text-yellow-800'
            }`}>
              {notification.message}
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideInRight {
          animation: slideInRight 0.4s ease-out;
        }
      `}</style>

      <div className="bg-white rounded-xl overflow-hidden shadow-md flex flex-col h-full border border-gray-100 group relative">
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

      {showOrderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-[#1A1A1A] mb-4">Selecciona el tamaño</h3>
            <p className="text-gray-600 mb-6">{pizza.name}</p>
            
            <div className="space-y-3">
              <button
                onClick={() => seleccionarTamanio('Personal')}
                className="w-full bg-[#0D4D45] hover:bg-[#08332e] text-white p-4 rounded-lg font-bold flex justify-between items-center transition"
              >
                <span>Personal</span>
                <span>S/ {pizza.price.toFixed(2)}</span>
              </button>
              
              {pizza.priceGrande && (
                <button
                  onClick={() => seleccionarTamanio('Grande')}
                  className="w-full bg-[#D14B4B] hover:bg-red-700 text-white p-4 rounded-lg font-bold flex justify-between items-center transition"
                >
                  <span>Grande</span>
                  <span>S/ {pizza.priceGrande.toFixed(2)}</span>
                </button>
              )}
            </div>

            <button
              onClick={() => setShowOrderModal(false)}
              className="w-full mt-4 bg-gray-200 hover:bg-gray-300 text-gray-700 p-3 rounded-lg font-bold transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {showDetallesModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-[#1A1A1A] mb-4">Datos de entrega</h3>
            <p className="text-gray-600 mb-4">
              {pizza.name} ({selectedSize}) - S/ {(selectedSize === 'Personal' ? pizza.price : pizza.priceGrande)?.toFixed(2)}
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Dirección de entrega *</label>
                <input
                  type="text"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  placeholder="Ej: Av. Principal 123, Chorrillos"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D14B4B] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Teléfono de contacto *</label>
                <input
                  type="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="Ej: 912345678"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D14B4B] focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowDetallesModal(false);
                  setDireccion('');
                  setTelefono('');
                  setSelectedSize(null);
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 p-3 rounded-lg font-bold transition"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarPedido}
                disabled={!direccion.trim() || !telefono.trim()}
                className="flex-1 bg-[#D14B4B] hover:bg-red-700 text-white p-3 rounded-lg font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirmar Pedido
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PizzaCard;