import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const categorias = [
  'PIZZAS CLASICAS',
  'PIZZAS ESPECIALES',
  'PIZZAS DULCES',
  'CALZONE Y PAN AL AJO',
  'EXTRAS',
  'PASTAS PLATOS',
  'ALITAS',
  'COMPLEMENTOS',
  'POSTRES',
  'BEBIDAS',
  'TRAGOS',
  'PARA COMPARTIR'
];

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const AdminProduct: React.FC = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const id = query.get('id');

  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'warning', message: string } | null>(null);

  const showNotification = (type: 'success' | 'error' | 'warning', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    const userRole = localStorage.getItem('rol');
    if (userRole !== 'ADMIN' && userRole !== 'MASTER') {
      showNotification('warning', 'No tienes permisos para acceder a esta página');
      setTimeout(() => navigate('/menu'), 2000);
    }
  }, [navigate]);

  const [form, setForm] = useState({
    nombre_producto: '',
    categoria: categorias[0],
    descripcion: '',
    ingredientes: '',
    imagen_url: '',
    precio_personal: '',
    precio_grande: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const token = localStorage.getItem('token');
      fetch(`http://localhost:8080/productos/${id}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      })
        .then(res => res.json())
        .then(data => {
          setForm({
            nombre_producto: data.nombre_producto,
            categoria: data.categoria.replace(/_/g, ' '),
            descripcion: data.descripcion,
            ingredientes: data.ingredientes,
            imagen_url: data.imagen_url,
            precio_personal: data.precio_personal.toString(),
            precio_grande: data.precio_grande ? data.precio_grande.toString() : ''
          });
        })
        .catch(err => {
          console.error('Error al cargar producto:', err);
          showNotification('error', 'Error al cargar el producto');
        });
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };

    const payload = {
      nombre_producto: form.nombre_producto,
      categoria: form.categoria.replace(/ /g, '_').toUpperCase(),
      descripcion: form.descripcion,
      ingredientes: form.ingredientes,
      imagen_url: form.imagen_url,
      precio_personal: parseFloat(form.precio_personal),
      precio_grande: form.precio_grande ? parseFloat(form.precio_grande) : null
    };

    try {
      if (id) {
        await fetch(`http://localhost:8080/productos/actualizar/${id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(payload)
        });
        showNotification('success', 'Producto actualizado exitosamente');
      } else {
        await fetch('http://localhost:8080/productos/crear', {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        });
        showNotification('success', 'Producto creado exitosamente');
      }

      setLoading(false);
      
      setTimeout(() => {
        navigate('/menu');
      }, 2000);

    } catch (error) {
      console.error('Error:', error);
      showNotification('error', 'Error al guardar el producto');
      setLoading(false);
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
            {notification.type === 'warning' && <AlertCircle className="text-yellow-500" size={24} />}
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

      <div className="min-h-screen bg-[#F3E3C2]/40 flex items-center justify-center py-8 px-2">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-[#0D4D45]/10 p-6">
          <div className="bg-[#0D4D45] rounded-xl py-4 mb-6 text-center shadow">
            <h2 className="text-2xl font-extrabold text-white uppercase tracking-widest">
              {id ? '✏️ Actualizar Producto' : '➕ Agregar Producto'}
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-bold text-[#0D4D45] text-sm">Nombre del producto</label>
              <input
                type="text"
                name="nombre_producto"
                value={form.nombre_producto}
                onChange={handleChange}
                required
                className="w-full mt-1 p-2 border rounded focus:border-[#D14B4B] focus:ring-[#D14B4B] transition"
              />
            </div>
            <div>
              <label className="font-bold text-[#0D4D45] text-sm">Categoría</label>
              <select
                name="categoria"
                value={form.categoria}
                onChange={handleChange}
                required
                className="w-full mt-1 p-2 border rounded bg-[#F3E3C2] text-[#0D4D45] font-bold focus:border-[#D14B4B] focus:ring-[#D14B4B] transition"
              >
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-bold text-[#0D4D45] text-sm">Descripción</label>
              <textarea
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                rows={2}
                className="w-full mt-1 p-2 border rounded focus:border-[#D14B4B] focus:ring-[#D14B4B] transition"
              />
            </div>
            <div>
              <label className="font-bold text-[#0D4D45] text-sm">Ingredientes</label>
              <textarea
                name="ingredientes"
                value={form.ingredientes}
                onChange={handleChange}
                rows={2}
                className="w-full mt-1 p-2 border rounded focus:border-[#D14B4B] focus:ring-[#D14B4B] transition"
              />
            </div>
            <div>
              <label className="font-bold text-[#0D4D45] text-sm">Imagen URL</label>
              <input
                type="text"
                name="imagen_url"
                value={form.imagen_url}
                onChange={handleChange}
                required
                className="w-full mt-1 p-2 border rounded focus:border-[#D14B4B] focus:ring-[#D14B4B] transition"
                placeholder="https://..."
              />
            </div>
            <div className="flex gap-2">
              <div className="w-1/2">
                <label className="font-bold text-[#0D4D45] text-sm">Precio Personal</label>
                <input
                  type="number"
                  name="precio_personal"
                  value={form.precio_personal}
                  onChange={handleChange}
                  required
                  step="0.01"
                  className="w-full mt-1 p-2 border rounded focus:border-[#D14B4B] focus:ring-[#D14B4B] transition"
                />
              </div>
              <div className="w-1/2">
                <label className="font-bold text-[#0D4D45] text-sm">Precio Grande (opcional)</label>
                <input
                  type="number"
                  name="precio_grande"
                  value={form.precio_grande}
                  onChange={handleChange}
                  step="0.01"
                  className="w-full mt-1 p-2 border rounded focus:border-[#D14B4B] focus:ring-[#D14B4B] transition"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate('/menu')}
                className="w-1/3 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 rounded-lg uppercase tracking-wider shadow-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-2/3 bg-[#D14B4B] hover:bg-[#0D4D45] text-white font-bold py-3 rounded-lg uppercase tracking-wider shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? (id ? '⏳ Actualizando...' : '⏳ Guardando...')
                  : (id ? '✅ Actualizar' : '✅ Agregar')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminProduct;