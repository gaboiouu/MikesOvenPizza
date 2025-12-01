import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';

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

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCart(JSON.parse(savedCart));

    const fetchUserPuntos = async () => {
      const user = JSON.parse(localStorage.getItem("user") || 'null');
      if (user) {
        try {
          const res = await fetch(`http://localhost:8080/users/${user.id}`);
          const data = await res.json();
          setPuntosUsuario(data.puntos || 0);
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchUserPuntos();
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
    const userData = JSON.parse(localStorage.getItem("user") || 'null');
    return userData?.id || null;
  };

  const validarFormulario = () => {
    if (cart.length === 0) {
      alert('Tu carrito está vacío.');
      return false;
    }
    if (!getUsuarioId()) {
      alert('Debes iniciar sesión para realizar pedidos.');
      return false;
    }
    if (!nombre.trim()) {
      alert('Ingresa el nombre completo.');
      return false;
    }
    if (!telefono.trim()) {
      alert('Ingresa un teléfono.');
      return false;
    }
    if (tipoPedido === 'DELIVERY' && !direccion.trim()) {
      alert('Ingresa la dirección para delivery.');
      return false;
    }
    return true;
  };

  const handleCanjearPuntos = async () => {
    const usuarioId = getUsuarioId();
    if (!usuarioId) return alert("Debes iniciar sesión");

    if (puntosACanjear <= 0) return alert("Ingresa puntos válidos");
    if (puntosACanjear > puntosUsuario) return alert("No tienes suficientes puntos");

    try {
      const res = await fetch(`http://localhost:8080/users/canjear-puntos/${usuarioId}?puntos=${puntosACanjear}`, {
        method: "POST"
      });
      if (!res.ok) throw new Error("Error al canjear puntos");
      const data = await res.json();
      setPuntosUsuario(data.puntos);
      
      setDescuento(puntosACanjear * VALOR_POR_PUNTO);
      alert(`¡Se aplicó un descuento de S/ ${(puntosACanjear * VALOR_POR_PUNTO).toFixed(2)}!`);
    } catch (err) {
      console.error(err);
      alert("No se pudo canjear los puntos");
    }
  };

  const enviarPedidoBackend = async () => {
    if (!validarFormulario()) return null;
    setLoading(true);

    const usuarioId = getUsuarioId();
    const pedidoPayload = {
      userId: usuarioId,
      estado: "PENDIENTE",
      total: calculateTotal() - descuento,
      direccionEntrega: tipoPedido === 'DELIVERY' ? direccion : null,
      telefonoContacto: telefono,
      notas,
      detalles: cart.map(item => ({
        productoId: item.id,
        cantidad: item.cantidad,
        precioUnitario: item.precio,
        tamanio: item.size || item.tamanio || null
      }))
    };

    try {
      const res = await fetch("http://localhost:8080/pedidos/crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedidoPayload)
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Error en servidor');
      }

      const data = await res.json();
      return data;
    } catch (err) {
      console.error(err);
      alert('No se pudo registrar el pedido en el servidor.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmarPedido = async () => {
    const pedidoCreado = await enviarPedidoBackend();
    if (!pedidoCreado) return;

    let msg = `🍕 *Pedido Registrado #${pedidoCreado.pedidoId}*\n`;
    msg += `Tipo: ${tipoPedido === 'DELIVERY' ? 'Delivery' : 'Recogida'}\n`;
    msg += `Nombre: ${nombre}\nTeléfono: ${telefono}\n`;
    if (tipoPedido === 'DELIVERY') msg += `Dirección: ${direccion}\n`;
    if (notas) msg += `Notas: ${notas}\n`;
    msg += `\n*Detalle:*\n`;

    cart.forEach((item, i) => {
      msg += `${i + 1}. ${item.name} - ${item.size || ''}\n   Cant: ${item.cantidad} x S/ ${item.precio.toFixed(2)} = S/ ${(item.precio * item.cantidad).toFixed(2)}\n`;
    });

    msg += `\nSubtotal: S/ ${calculateSubtotal().toFixed(2)}\n`;
    msg += `Delivery: S/ ${deliveryFee.toFixed(2)}\n`;
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

    alert('Pedido realizado correctamente.');
  };

  return (
    <div className="min-h-screen bg-[#F3E3C2]/20 py-8">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-[#0D4D45] rounded-2xl p-6 mb-6 shadow-xl flex items-center gap-4">
            <button onClick={() => window.history.back()} className="bg-white/10 p-2 rounded-lg hover:bg-white/20">
              <ArrowLeft size={24} className="text-white" />
            </button>
            <div>
              <h1 className="text-3xl text-white font-extrabold uppercase">Tu Carrito</h1>
              <p className="text-[#F3E3C2] mt-1">{cart.length} {cart.length === 1 ? 'producto' : 'productos'}</p>
            </div>
          </div>

          {cart.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl shadow-lg text-center">
              <ShoppingBag size={80} className="mx-auto text-gray-300 mb-4" />
              <h2 className="text-2xl font-bold text-gray-700">Tu carrito está vacío</h2>
              <p className="text-gray-500">Agrega productos deliciosos</p>
            </div>
          ) : (
            cart.map((item, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 mb-6 shadow-lg flex items-center gap-4">
                <img src={item.imagen || item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-xl" />
                <div className="flex-1">
                  <h3 className="text-lg font-bold">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.size || ''}</p>
                  <p className="mt-2 font-bold">S/ {item.precio.toFixed(2)}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <button onClick={() => updateQuantity(index, -1)} className="p-2 bg-gray-200 rounded-full"><Minus size={16} /></button>
                    <span className="text-lg font-bold">{item.cantidad}</span>
                    <button onClick={() => updateQuantity(index, 1)} className="p-2 bg-gray-200 rounded-full"><Plus size={16} /></button>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <button onClick={() => removeFromCart(index)} className="p-2 bg-red-500 text-white rounded-lg flex items-center gap-2">
                    <Trash2 size={16} /> Quitar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <aside className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
            <h4 className="font-bold text-lg mb-4">Información de Entrega</h4>
            <div className="mb-4">
              <label className="text-sm font-semibold mb-2 block">Tipo de Pedido</label>
              <div className="flex gap-3">
                <button onClick={() => setTipoPedido('DELIVERY')} className={`px-4 py-2 rounded-lg border ${tipoPedido === 'DELIVERY' ? 'bg-[#0D4D45] text-white' : 'bg-white'}`}>Delivery</button>
                <button onClick={() => setTipoPedido('RECOJO')} className={`px-4 py-2 rounded-lg border ${tipoPedido === 'RECOJO' ? 'bg-[#0D4D45] text-white' : 'bg-white'}`}>Recogida</button>
              </div>
            </div>

            <div className="mb-3">
              <label className="text-sm font-semibold block mb-1">Nombre Completo *</label>
              <input value={nombre} onChange={e => setNombre(e.target.value)} className="w-full p-3 border rounded-lg bg-gray-50" placeholder="Tu nombre" />
            </div>

            <div className="mb-3">
              <label className="text-sm font-semibold block mb-1">Teléfono *</label>
              <input value={telefono} onChange={e => setTelefono(e.target.value)} className="w-full p-3 border rounded-lg bg-gray-50" placeholder="+51 9xx xxx xxx" />
            </div>

            {tipoPedido === 'DELIVERY' && (
              <div className="mb-3">
                <label className="text-sm font-semibold block mb-1">Dirección *</label>
                <input value={direccion} onChange={e => setDireccion(e.target.value)} className="w-full p-3 border rounded-lg bg-gray-50" placeholder="Dirección de entrega" />
              </div>
            )}

            <div className="mb-3">
              <label className="text-sm font-semibold block mb-1">Notas adicionales</label>
              <textarea value={notas} onChange={e => setNotas(e.target.value)} className="w-full p-3 border rounded-lg bg-gray-50" placeholder="Indicaciones especiales" rows={3} />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h4 className="font-bold text-lg mb-4">Resumen del Pedido</h4>

            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>S/ {calculateSubtotal().toFixed(2)}</span>
            </div>

            <div className="flex justify-between mb-2">
              <span>Delivery</span>
              <span>S/ {deliveryFee.toFixed(2)}</span>
            </div>

            {/* CANJEAR PUNTOS */}
            <div className="mb-4 mt-2">
              <label className="text-sm font-semibold block mb-1">Tus puntos: {puntosUsuario}</label>
              <input 
                type="number" 
                value={puntosACanjear} 
                onChange={e => setPuntosACanjear(Number(e.target.value))} 
                max={puntosUsuario}
                className="w-full p-2 border rounded-lg"
                placeholder="Ingresa puntos a canjear"
              />
              <button 
                onClick={handleCanjearPuntos}
                className="mt-2 w-full bg-[#0D4D45] text-white py-2 rounded-lg font-bold"
              >
                Canjear Puntos
              </button>
            </div>

            {descuento > 0 && (
              <div className="flex justify-between mb-2">
                <span>Descuento por puntos</span>
                <span>- S/ {descuento.toFixed(2)}</span>
              </div>
            )}

            <div className="border-t mt-3 pt-3 flex justify-between items-center">
              <strong>Total</strong>
              <strong className="text-lg text-green-700">S/ {(calculateTotal() - descuento).toFixed(2)}</strong>
            </div>

            <button
              disabled={loading}
              onClick={handleConfirmarPedido}
              className="w-full mt-5 bg-[#25D366] hover:bg-[#1aa75b] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-3"
            >
              <ShoppingBag size={18} />
              {loading ? 'Procesando...' : 'Ordenar por WhatsApp'}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CarritoCompras;
