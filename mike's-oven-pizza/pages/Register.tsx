import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Mail, ArrowRight, Pizza } from 'lucide-react';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nombreCompleto, setNombreCompleto] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    try {
      const response = await fetch('http://localhost:8080/users/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password,
          nombreCompleto: nombreCompleto
        })
      });
      if (response.ok) {
        const user = await response.json();
        localStorage.setItem('user', JSON.stringify(user)); // Guarda el usuario
        navigate('/'); // Redirige a la principal
      } else {
        alert('Error en el registro');
      }
    } catch (error) {
      alert('Error de conexión');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3E3C2]/30 py-8 px-2 sm:px-6 lg:px-8">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl bg-white p-6 sm:p-10 rounded-2xl shadow-2xl border-t-4 border-[#0D4D45]">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#0D4D45] text-white mb-4 shadow-lg">
            <Pizza size={32} />
          </div>
          <h2 className="text-3xl font-extrabold text-[#1A1A1A] uppercase tracking-wide">
            Únete a la familia
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Crea tu cuenta y disfruta de promociones exclusivas
          </p>
        </div>
        <form className="mt-8 space-y-4" onSubmit={handleRegister}>
          <div className="relative">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Nombre Completo</label>
            <div className="flex items-center border rounded-lg bg-gray-50 focus-within:ring-2 focus-within:ring-[#0D4D45] overflow-hidden">
              <div className="pl-3 text-gray-400"><User size={20} /></div>
              <input
                type="text"
                value={nombreCompleto}
                onChange={e => setNombreCompleto(e.target.value)}
                className="appearance-none bg-transparent border-none w-full text-gray-700 py-3 px-3 leading-tight focus:outline-none"
                placeholder="Mike Torres"
              />
            </div>
          </div>

          <div className="relative">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Correo Electrónico</label>
            <div className="flex items-center border rounded-lg bg-gray-50 focus-within:ring-2 focus-within:ring-[#0D4D45] overflow-hidden">
              <div className="pl-3 text-gray-400"><Mail size={20} /></div>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="appearance-none bg-transparent border-none w-full text-gray-700 py-3 px-3 leading-tight focus:outline-none"
                placeholder="mike@pizza.com"
              />
            </div>
          </div>

          <div className="relative">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Contraseña</label>
            <div className="flex items-center border rounded-lg bg-gray-50 focus-within:ring-2 focus-within:ring-[#0D4D45] overflow-hidden">
              <div className="pl-3 text-gray-400"><Lock size={20} /></div>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="appearance-none bg-transparent border-none w-full text-gray-700 py-3 px-3 leading-tight focus:outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="relative">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Confirmar Contraseña</label>
            <div className="flex items-center border rounded-lg bg-gray-50 focus-within:ring-2 focus-within:ring-[#0D4D45] overflow-hidden">
              <div className="pl-3 text-gray-400"><Lock size={20} /></div>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="appearance-none bg-transparent border-none w-full text-gray-700 py-3 px-3 leading-tight focus:outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-[#0D4D45] hover:bg-[#08332e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0D4D45] uppercase tracking-widest shadow-lg transform transition hover:scale-[1.02]"
            >
              Crear Cuenta
              <span className="absolute right-0 inset-y-0 flex items-center pr-3">
                <ArrowRight size={16} className="text-white" />
              </span>
            </button>
          </div>
        </form>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="font-bold text-[#0D4D45] hover:text-[#08332e]">
              Inicia Sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;