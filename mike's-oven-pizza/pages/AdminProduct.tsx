import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

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

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.rol !== 'ADMIN' && user.rol !== 'MASTER') {
      navigate('/menu');
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
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:8080/productos/${id}`)
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
        });
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const payload = {
      nombre_producto: form.nombre_producto,
      categoria: form.categoria.replace(/ /g, '_').toUpperCase(),
      descripcion: form.descripcion,
      ingredientes: form.ingredientes,
      imagen_url: form.imagen_url,
      precio_personal: parseFloat(form.precio_personal),
      precio_grande: form.precio_grande ? parseFloat(form.precio_grande) : null
    };

    if (id) {
      await fetch(`http://localhost:8080/productos/actualizar/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } else {
      await fetch('http://localhost:8080/productos/crear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }

    setLoading(false);
    setSuccess(true);
    navigate('/menu'); 

    if (!id) {
      setForm({
        nombre_producto: '',
        categoria: categorias[0],
        descripcion: '',
        ingredientes: '',
        imagen_url: '',
        precio_personal: '',
        precio_grande: ''
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F3E3C2]/40 flex items-center justify-center py-8 px-2">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-[#0D4D45]/10 p-6">
        <div className="bg-[#0D4D45] rounded-xl py-4 mb-6 text-center shadow">
          <h2 className="text-2xl font-extrabold text-white uppercase tracking-widest">
            {id ? 'Actualizar Producto' : 'Agregar Producto'}
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
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#D14B4B] hover:bg-[#0D4D45] text-white font-bold py-3 rounded-lg uppercase tracking-widest shadow-lg transition-colors"
          >
            {loading
              ? (id ? 'Actualizando...' : 'Guardando...')
              : (id ? 'Actualizar Producto' : 'Agregar Producto')}
          </button>
          {success && (
            <div className="text-green-600 font-bold text-center mt-2">
              Producto agregado correctamente.
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AdminProduct;