import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const WHATSAPP_NUMBER = "51912077181";
const DELIVERY_FEE = 10;
const VALOR_POR_PUNTO = 0.10; 

const CarritoCompras: React.FC = () => {
  const [cart, setCart] = useState<any[]>([]);
  const [tipoPedido, setTipoPedido] = useState<'DELIVERY' | 'RECOJO'>('RECOJO');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [notas, setNotas] = useState('');
  const [loading, setLoading] = useState(false);
  const [puntosUsuario, setPuntosUsuario] = useState(0);
  const [puntosACanjear, setPuntosACanjear] = useState(0);
  const [descuento, setDescuento] = useState(0);

  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'warning', message: string } | null>(null);

  const showNotification = (type: 'success' | 'error' | 'warning', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCart(JSON.parse(savedCart));

    const fetchUserPuntos = async () => {
      const userId = localStorage.getItem('userId');
      console.log('🔍 userId desde localStorage:', userId);
      
      if (!userId) {
        console.warn('⚠️ No hay userId en localStorage. Usuario no autenticado.');
        return;
      }
      
      try {
        const token = localStorage.getItem('token');
        console.log('🔑 Token existe:', token ? 'SÍ' : 'NO');
        
        const url = `http://localhost:8080/users/me`;
        console.log('📡 Fetching URL:', url);
        
        const res = await fetch(url, {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
          }
        });
        
        console.log('📊 Status HTTP:', res.status, res.statusText);
        
        if (!res.ok) {
          const errorText = await res.text();
          console.error('❌ Error del servidor:', errorText);
          throw new Error(`HTTP ${res.status}: ${errorText}`);
        }
        
        const data = await res.json();
        console.log('📦 Respuesta completa del backend:', data);
        console.log('🏆 Puntos del usuario:', data.puntos);
        
        if (data && typeof data.puntos === 'number') {
          console.log('✅ Asignando puntos al estado:', data.puntos);
          setPuntosUsuario(data.puntos);
        } else {
          console.error('❌ El campo "puntos" no existe o no es un número:', data);
          setPuntosUsuario(0);
        }
        
      } catch (err) {
        console.error('❌ Error al cargar puntos:', err);
        showNotification('error', 'No se pudieron cargar tus puntos de fidelidad');
      }
    };
    
    fetchUserPuntos();

    const nombreCompleto = localStorage.getItem('nombreCompleto');
    if (nombreCompleto) {
      setNombre(nombreCompleto);
    }
  }, []);

  const updateCart = (newCart: any[]) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const removeFromCart = (index: number) => {
    updateCart(cart.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, delta: number) => {
    const newCart = [...cart];
    newCart[index].cantidad = Math.max(1, newCart[index].cantidad + delta);
    updateCart(newCart);
  };

  const calculateSubtotal = () => cart.reduce((s, item) => s + item.precio * item.cantidad, 0);
  const deliveryFee = tipoPedido === 'DELIVERY' ? DELIVERY_FEE : 0;
  const calculateTotal = () => calculateSubtotal() + deliveryFee;

  const getUsuarioId = () => {
    return localStorage.getItem('userId');
  };

  const validarFormulario = () => {
    if (cart.length === 0) {
      showNotification('warning', 'Tu carrito está vacío');
      return false;
    }
    const userId = getUsuarioId();
    if (!userId) {
      showNotification('warning', 'Debes iniciar sesión para realizar pedidos');
      return false;
    }
    if (!nombre.trim()) {
      showNotification('warning', 'Ingresa el nombre completo');
      return false;
    }
    if (!telefono.trim()) {
      showNotification('warning', 'Ingresa un teléfono');
      return false;
    }
    if (tipoPedido === 'DELIVERY' && !direccion.trim()) {
      showNotification('warning', 'Ingresa la dirección para delivery');
      return false;
    }
    return true;
  };

  const handleCanjearPuntos = async () => {
    const usuarioId = getUsuarioId();
    if (!usuarioId) {
      showNotification('warning', 'Debes iniciar sesión');
      return;
    }

    const puntosNum = Number(puntosACanjear);
    
    console.log('Debug - Puntos ingresados:', puntosNum); 
    console.log('Debug - Puntos disponibles:', puntosUsuario); 

    if (!puntosACanjear || puntosNum <= 0 || isNaN(puntosNum)) {
      showNotification('warning', 'Por favor ingresa una cantidad de puntos mayor a 0');
      return;
    }
    
    if (puntosNum > puntosUsuario) {
      showNotification('warning', `Solo tienes ${puntosUsuario} puntos disponibles`);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      console.log('🔄 Canjeando:', puntosNum, 'puntos...'); 
      
      const res = await fetch(`http://localhost:8080/users/canjear-puntos/${usuarioId}?puntos=${puntosNum}`, {
        method: "POST",
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('❌ Error del servidor:', errorText);
        throw new Error("Error al canjear puntos");
      }
      
      const data = await res.json();
      console.log('✅ Respuesta exitosa:', data); 
      
      setPuntosUsuario(data.puntos);
      setDescuento(puntosNum * VALOR_POR_PUNTO);
      setPuntosACanjear(0); 
      
      showNotification('success', `✅ Canjeaste ${puntosNum} puntos. Descuento: S/ ${(puntosNum * VALOR_POR_PUNTO).toFixed(2)}`);
    } catch (err) {
      console.error('❌ Error:', err);
      showNotification('error', 'No se pudo canjear los puntos. Intenta nuevamente.');
    }
  };

  const enviarPedidoBackend = async () => {
    if (!validarFormulario()) return null;
    setLoading(true);

    const usuarioId = getUsuarioId();
    const token = localStorage.getItem('token');
    
    const pedidoPayload = {
      userId: Number(usuarioId),
      estado: "PENDIENTE",
      total: calculateTotal() - descuento,
      direccionEntrega: tipoPedido === 'DELIVERY' ? direccion : null,
      telefonoContacto: telefono,
      notas,
      detalles: cart.map(item => ({
        productoId: item.id,
        nombreProducto: item.name, 
        cantidad: item.cantidad,
        precioUnitario: item.precio,
        subtotal: item.precio * item.cantidad,
        tamanio: item.size || item.tamanio || null
      }))
    };

    try {
      const res = await fetch("http://localhost:8080/pedidos/crear", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(pedidoPayload)
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('❌ Error al crear pedido:', text);
        throw new Error(text || 'Error en servidor');
      }

      const data = await res.json();
      console.log('✅ Pedido creado:', data); 
      return data;
    } catch (err) {
      console.error('❌ Error en enviarPedidoBackend:', err);
      showNotification('error', 'No se pudo registrar el pedido en el servidor');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmarPedido = async () => {
    const pedidoCreado = await enviarPedidoBackend();
    if (!pedidoCreado) return;

    let msg = `🍕 *Pedido Registrado #${pedidoCreado.pedidoId}*\n`;
    msg += `Tipo: ${tipoPedido === 'DELIVERY' ? 'Delivery' : 'Recogida en Tienda'}\n`;
    msg += `Nombre: ${nombre}\nTeléfono: ${telefono}\n`;
    if (tipoPedido === 'DELIVERY') msg += `Dirección: ${direccion}\n`;
    if (notas) msg += `Notas: ${notas}\n`;
    msg += `\n*Detalle:*\n`;

    cart.forEach((item, i) => {
      msg += `${i + 1}. ${item.name} - ${item.size || ''}\n   Cant: ${item.cantidad} x S/ ${item.precio.toFixed(2)} = S/ ${(item.precio * item.cantidad).toFixed(2)}\n`;
    });

    msg += `\nSubtotal: S/ ${calculateSubtotal().toFixed(2)}\n`;
    if (tipoPedido === 'DELIVERY') {
      msg += `Delivery: S/ ${deliveryFee.toFixed(2)}\n`;
    }
    if (descuento > 0) msg += `Descuento: - S/ ${descuento.toFixed(2)}\n`;
    msg += `*TOTAL: S/ ${(calculateTotal() - descuento).toFixed(2)}*\n`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');

    localStorage.removeItem('cart');
    setCart([]);
    setNombre('');
    setTelefono('');
    setDireccion('');
    setNotas('');
    setTipoPedido('RECOJO');
    setPuntosACanjear(0);
    setDescuento(0);

    showNotification('success', 'Pedido realizado correctamente');
  };

  return (
    <>
      {notification && (
        <div className="fixed top-4 right-4 left-4 sm:left-auto sm:right-4 z-[9999] animate-slideInRight">
          <div className={`flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-lg shadow-2xl border-l-4 ${
            notification.type === 'success' 
              ? 'bg-green-50 border-green-500' 
              : notification.type === 'error'
              ? 'bg-red-50 border-red-500'
              : 'bg-yellow-50 border-yellow-500'
          }`}>
            {notification.type === 'success' && <CheckCircle className="text-green-500 flex-shrink-0" size={20} />}
            {notification.type === 'error' && <XCircle className="text-red-500 flex-shrink-0" size={20} />}
            {notification.type === 'warning' && <AlertCircle className="text-yellow-500 flex-shrink-0" size={20} />}
            <p className={`font-semibold text-sm sm:text-base ${
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

      <div className="min-h-screen bg-[#F3E3C2]/20 py-4 sm:py-8">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2">
            <div className="bg-[#0D4D45] rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-xl flex items-center gap-3 sm:gap-4">
              <button onClick={() => window.history.back()} className="bg-white/10 p-2 rounded-lg hover:bg-white/20 flex-shrink-0">
                <ArrowLeft size={20} className="text-white sm:w-6 sm:h-6" />
              </button>
              <div>
                <h1 className="text-xl sm:text-3xl text-white font-extrabold uppercase">Tu Carrito</h1>
                <p className="text-[#F3E3C2] mt-1 text-xs sm:text-base">{cart.length} {cart.length === 1 ? 'producto' : 'productos'}</p>
              </div>
            </div>

            {cart.length === 0 ? (
              <div className="bg-white p-8 sm:p-12 rounded-xl sm:rounded-2xl shadow-lg text-center">
                <ShoppingBag size={60} className="mx-auto text-gray-300 mb-4 sm:w-20 sm:h-20" />
                <h2 className="text-xl sm:text-2xl font-bold text-gray-700">Tu carrito está vacío</h2>
                <p className="text-gray-500 mt-2 text-sm sm:text-base">Agrega productos deliciosos desde nuestro menú</p>
                <a href="/menu" className="mt-4 inline-block bg-[#D14B4B] text-white px-6 py-3 rounded-full font-bold hover:bg-red-700 text-sm sm:text-base">
                  Ver Menú
                </a>
              </div>
            ) : (
              cart.map((item, index) => (
                <div key={index} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-lg">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <img src={item.imagen || item.imageUrl} alt={item.name} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg sm:rounded-xl flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-bold truncate">{item.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-600">{item.size || ''}</p>
                      <p className="mt-1 sm:mt-2 font-bold text-[#D14B4B] text-sm sm:text-base">S/ {item.precio.toFixed(2)}</p>
                      <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-3">
                        <button onClick={() => updateQuantity(index, -1)} className="p-1.5 sm:p-2 bg-gray-200 hover:bg-gray-300 rounded-full transition">
                          <Minus size={14} className="sm:w-4 sm:h-4" />
                        </button>
                        <span className="text-base sm:text-lg font-bold w-6 sm:w-8 text-center">{item.cantidad}</span>
                        <button onClick={() => updateQuantity(index, 1)} className="p-1.5 sm:p-2 bg-gray-200 hover:bg-gray-300 rounded-full transition">
                          <Plus size={14} className="sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 sm:gap-3">
                      <p className="text-base sm:text-lg font-bold text-[#0D4D45]">S/ {(item.precio * item.cantidad).toFixed(2)}</p>
                      <button onClick={() => removeFromCart(index)} className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center gap-1 sm:gap-2 transition text-xs sm:text-sm">
                        <Trash2 size={14} className="sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Quitar</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <aside className="lg:col-span-1">
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg mb-4 sm:mb-6">
              <h4 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">Información de Entrega</h4>
              <div className="mb-3 sm:mb-4">
                <label className="text-xs sm:text-sm font-semibold mb-2 block">Tipo de Pedido</label>
                <div className="flex gap-2 sm:gap-3">
                  <button onClick={() => setTipoPedido('DELIVERY')} className={`flex-1 px-3 sm:px-4 py-2 rounded-lg border font-semibold transition text-xs sm:text-base ${tipoPedido === 'DELIVERY' ? 'bg-[#0D4D45] text-white border-[#0D4D45]' : 'bg-white hover:bg-gray-50'}`}>
                    Delivery
                  </button>
                  <button onClick={() => setTipoPedido('RECOJO')} className={`flex-1 px-3 sm:px-4 py-2 rounded-lg border font-semibold transition text-xs sm:text-base ${tipoPedido === 'RECOJO' ? 'bg-[#0D4D45] text-white border-[#0D4D45]' : 'bg-white hover:bg-gray-50'}`}>
                    Recogida
                  </button>
                </div>
              </div>

              <div className="mb-3">
                <label className="text-xs sm:text-sm font-semibold block mb-1">Nombre Completo *</label>
                <input value={nombre} onChange={e => setNombre(e.target.value)} className="w-full p-2 sm:p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0D4D45] text-sm sm:text-base" placeholder="Tu nombre" />
              </div>

              <div className="mb-3">
                <label className="text-xs sm:text-sm font-semibold block mb-1">Teléfono *</label>
                <input value={telefono} onChange={e => setTelefono(e.target.value)} className="w-full p-2 sm:p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0D4D45] text-sm sm:text-base" placeholder="+51 9xx xxx xxx" />
              </div>

              {tipoPedido === 'DELIVERY' && (
                <div className="mb-3">
                  <label className="text-xs sm:text-sm font-semibold block mb-1">Dirección *</label>
                  <input value={direccion} onChange={e => setDireccion(e.target.value)} className="w-full p-2 sm:p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0D4D45] text-sm sm:text-base" placeholder="Dirección de entrega" />
                </div>
              )}

              <div className="mb-3">
                <label className="text-xs sm:text-sm font-semibold block mb-1">Notas adicionales</label>
                <textarea value={notas} onChange={e => setNotas(e.target.value)} className="w-full p-2 sm:p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0D4D45] text-sm sm:text-base" placeholder="Indicaciones especiales" rows={3} />
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
              <h4 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">Resumen del Pedido</h4>

              <div className="flex justify-between mb-2 text-gray-700 text-sm sm:text-base">
                <span>Subtotal</span>
                <span className="font-semibold">S/ {calculateSubtotal().toFixed(2)}</span>
              </div>

              {tipoPedido === 'DELIVERY' && (
                <div className="flex justify-between mb-2 text-gray-700 text-sm sm:text-base">
                  <span>Delivery</span>
                  <span className="font-semibold">S/ {deliveryFee.toFixed(2)}</span>
                </div>
              )}

              <div className="mb-4 mt-4 p-3 sm:p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <label className="text-xs sm:text-sm font-semibold block mb-2">🏆 Tus puntos: <span className="text-[#FF8F3A] text-base sm:text-lg">{puntosUsuario}</span></label>
                <input 
                  type="number" 
                  value={puntosACanjear} 
                  onChange={e => setPuntosACanjear(Number(e.target.value))} 
                  max={puntosUsuario}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8F3A] text-sm sm:text-base"
                  placeholder="Puntos a canjear"
                />
                <p className="text-xs text-gray-500 mt-1">1 punto = S/ 0.10</p>
                <button 
                  onClick={handleCanjearPuntos}
                  className="mt-2 w-full bg-[#FF8F3A] hover:bg-[#e67e2f] text-white py-2 rounded-lg font-bold transition text-sm sm:text-base"
                >
                  Canjear Puntos
                </button>
              </div>

              {descuento > 0 && (
                <div className="flex justify-between mb-2 text-green-600 text-sm sm:text-base">
                  <span>Descuento por puntos</span>
                  <span className="font-bold">- S/ {descuento.toFixed(2)}</span>
                </div>
              )}

              <div className="border-t-2 mt-3 pt-3 flex justify-between items-center">
                <strong className="text-base sm:text-lg">Total</strong>
                <strong className="text-xl sm:text-2xl text-[#0D4D45]">S/ {(calculateTotal() - descuento).toFixed(2)}</strong>
              </div>

              <button
                disabled={loading || cart.length === 0}
                onClick={handleConfirmarPedido}
                className="w-full mt-4 sm:mt-5 bg-[#25D366] hover:bg-[#1aa75b] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 sm:py-4 rounded-xl flex items-center justify-center gap-2 sm:gap-3 transition shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                <ShoppingBag size={18} className="sm:w-5 sm:h-5" />
                {loading ? 'Procesando...' : 'Ordenar por WhatsApp'}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};

export default CarritoCompras;
