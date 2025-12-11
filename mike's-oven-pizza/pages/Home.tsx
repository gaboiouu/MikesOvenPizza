import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Flame, Star, TrendingUp } from 'lucide-react';
import PizzaCard from '../components/PizzaCard';
import { Pizza, WHATSAPP_NUMBER } from '../types';

const Home: React.FC = () => {
  const [featuredPizzas, setFeaturedPizzas] = useState<Pizza[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductosMasPedidos = async () => {
      try {
        const masPedidosResponse = await fetch('http://localhost:8080/reportes/productos-mas-vendidos?limit=3', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!masPedidosResponse.ok) {
          throw new Error('Error al cargar productos más vendidos');
        }

        const data = await masPedidosResponse.json();
        console.log('📊 Productos más vendidos:', data);

        const productosMapeados = data.map((item: any) => ({
          id: item.productoId,
          name: item.nombreProducto,
          description: item.ingredientes || '',
          price: item.precioPersonal || 0,
          priceGrande: item.precioGrande || 0,
          imageUrl: item.imagenUrl,
          category: item.categoria || '',
          cantidadPedidos: item.cantidadVendida
        }));

        setFeaturedPizzas(productosMapeados);

      } catch (error) {
        console.error('❌ Error al cargar productos más pedidos:', error);
        
        try {
          const response = await fetch('http://localhost:8080/productos/listar', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const data = await response.json();
            const mapped = data.slice(0, 3).map((p: any) => ({
              id: p.producto_id,
              name: p.nombre_producto,
              description: p.ingredientes,
              price: p.precio_personal,
              priceGrande: p.precio_grande,
              imageUrl: p.imagen_url,
              category: p.categoria.replace(/_/g, ' '),
              cantidadPedidos: 0
            }));
            setFeaturedPizzas(mapped);
          }
        } catch (fallbackError) {
          console.error('❌ Error en fallback:', fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProductosMasPedidos();
  }, []);

  return (
    <div className="flex flex-col">
      <div className="relative h-[600px] w-full bg-gray-900 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop" 
          alt="Mike's Oven" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D4D45]/90 to-transparent"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex flex-col justify-center text-white">
          <div className="max-w-2xl animate-fade-in-up">
            <span className="text-[#FF8F3A] font-bold tracking-widest uppercase mb-2 block">Auténtico Sabor Artesanal</span>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
              EL FUEGO <br/> <span className="text-[#F3E3C2]">HACE LA MAGIA</span>
            </h1>
            <p className="text-lg text-gray-200 mb-8 max-w-lg">
              Ingredientes frescos, masa madre y un horno de leña que nunca descansa. Ven a probar la diferencia de Mike's Oven Pizza.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer"
                className="bg-[#D14B4B] hover:bg-red-600 text-white px-8 py-4 rounded font-bold uppercase tracking-widest text-center shadow-lg transition-transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <Flame size={20} /> Pedir Ahora
              </a>
              <Link 
                to="/menu"
                className="bg-white text-[#1A1A1A] hover:bg-gray-100 px-8 py-4 rounded font-bold uppercase tracking-widest text-center shadow-lg transition-colors"
              >
                Ver Carta Completa
              </Link>
            </div>
          </div>
        </div>
      </div>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="text-[#D14B4B]" size={24} />
                <span className="text-[#D14B4B] font-bold uppercase text-sm tracking-widest">Favoritas</span>
              </div>
              <h2 className="text-4xl font-extrabold text-[#1A1A1A] mt-2">LAS MÁS PEDIDAS</h2>
              <p className="text-gray-600 mt-2">Basado en pedidos reales de nuestros clientes</p>
            </div>
            <Link to="/menu" className="hidden md:flex items-center text-[#0D4D45] font-bold hover:underline">
              Ver todas <ChevronRight size={20} />
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-gray-200 rounded-lg h-96 animate-pulse"></div>
              ))}
            </div>
          ) : featuredPizzas.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No hay productos disponibles aún</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredPizzas.map((pizza: any) => (
                <div key={pizza.id} className="relative">
                  <PizzaCard pizza={pizza} />
                  {pizza.cantidadPedidos > 0 && (
                    <div className="absolute top-4 right-4 bg-[#FF8F3A] text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 z-10">
                      <Flame size={14} />
                      {pizza.cantidadPedidos} {pizza.cantidadPedidos === 1 ? 'vez' : 'veces'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-12 text-center md:hidden">
            <Link to="/menu" className="inline-block border-2 border-[#0D4D45] text-[#0D4D45] px-8 py-3 rounded-full font-bold uppercase">
              Ver Menú Completo
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#0D4D45] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-12">
           <div className="md:w-1/2">
             <img 
               src="https://images.unsplash.com/photo-1590947132387-155cc02f3212?q=80&w=2070&auto=format&fit=crop" 
               alt="El Horno" 
               className="rounded-lg shadow-2xl border-4 border-[#F3E3C2]"
             />
           </div>
           <div className="md:w-1/2 space-y-6">
             <div className="flex items-center gap-2 text-[#FF8F3A] font-bold uppercase tracking-wide">
               <Star size={18} fill="#FF8F3A" /> Historia
             </div>
             <h2 className="text-4xl font-bold text-[#F3E3C2]">MÁS QUE UNA PIZZA, UNA TRADICIÓN</h2>
             <p className="text-gray-300 leading-relaxed">
              Desde nuestro foodtruck en 2022, Toof honra la memoria de Mike, el perrito que inspiró nuestro nombre y espíritu. Cada plato conserva esa esencia: productos frescos, pasión por el buen sabor y un cariño que nunca se pierde.             </p>
             <Link to="/about" className="inline-block bg-[#FF8F3A] text-[#1A1A1A] px-6 py-3 rounded font-bold uppercase hover:bg-[#e67e2f] transition-colors">
               Conoce nuestra historia
             </Link>
           </div>
        </div>
      </section>
    </div>
  );
};

export default Home;