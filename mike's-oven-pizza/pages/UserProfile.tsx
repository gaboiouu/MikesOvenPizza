import React, { useEffect, useState } from 'react';
import { User as UserIcon, AtSign, Star, Calendar } from 'lucide-react';

interface User {
  nombreCompleto: string;
  email: string;
  rol: string;
  fechaRegistro: string;
  puntos: number;
}

const PerfilUsuario: React.FC = () => {
  const [usuario, setUsuario] = useState<User | null>(null);

  const userId = JSON.parse(localStorage.getItem('user') || 'null')?.id;

  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:8080/users/${userId}/perfil`)
      .then(res => res.json())
      .then(data => setUsuario(data))
      .catch(err => console.error(err));
  }, [userId]);

  if (!usuario) return <p className="text-center mt-10 text-gray-500">Cargando...</p>;

  return (
    <div className="max-w-lg mx-auto mt-10 p-8 bg-white rounded-2xl shadow-xl border border-gray-200">
      <div className="flex items-center space-x-4 mb-6">
        <div className="bg-[#0D4D45] text-white rounded-full w-20 h-20 flex items-center justify-center text-3xl font-bold">
          {usuario.nombreCompleto.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{usuario.nombreCompleto}</h2>
          <p className="text-gray-500">Bienvenido a tu cuenta personal</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg shadow-sm">
          <AtSign size={24} className="text-[#0D4D45]" />
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium text-gray-800">{usuario.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg shadow-sm">
          <UserIcon size={24} className="text-[#D14B4B]" />
          <div>
            <p className="text-sm text-gray-500">Rol</p>
            <p className="font-medium text-gray-800">{usuario.rol}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg shadow-sm">
          <Calendar size={24} className="text-[#FF8F3A]" />
          <div>
            <p className="text-sm text-gray-500">Fecha de registro</p>
            <p className="font-medium text-gray-800">{new Date(usuario.fechaRegistro).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg shadow-sm">
          <Star size={24} className="text-yellow-500" />
          <div>
            <p className="text-sm text-gray-500">Puntos acumulados</p>
            <p className="font-medium text-gray-800">{usuario.puntos}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <button className="bg-[#0D4D45] hover:bg-[#074036] text-white px-6 py-2 rounded-full font-bold shadow-md transition duration-200">
          Editar información
        </button>
      </div>
    </div>
  );
};

export default PerfilUsuario;
