import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, ArrowRight } from 'lucide-react';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: username,
          password: password
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('email', data.email);
        localStorage.setItem('nombreCompleto', data.nombreCompleto);
        localStorage.setItem('rol', data.rol);
        localStorage.setItem('userId', data.userId);
        
        window.dispatchEvent(new Event('storage'));
        
        alert('Login exitoso');
        navigate('/');
      } else {
        alert('Credenciales incorrectas');
      }
    } catch (error) {
      alert('Error de conexión');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3E3C2]/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-2xl border-t-4 border-[#0D4D45]">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#0D4D45] text-[#F3E3C2] mb-4 shadow-lg">
            <User size={32} />
          </div>
          <h2 className="text-3xl font-extrabold text-[#1A1A1A] uppercase tracking-wide">
            Bienvenido
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Ingresa a tu cuenta Mike's Oven Pizza
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm space-y-4">
            <div className="relative">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Usuario</label>
              <div className="flex items-center border rounded-lg bg-gray-50 focus-within:ring-2 focus-within:ring-[#D14B4B] overflow-hidden">
                <div className="pl-3 text-gray-400"><User size={20} /></div>
                <input
                  type="text"
                  required
                  className="appearance-none bg-transparent border-none w-full text-gray-700 py-3 px-3 leading-tight focus:outline-none"
                  placeholder="Usuario o Email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>
            <div className="relative">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Contraseña</label>
              <div className="flex items-center border rounded-lg bg-gray-50 focus-within:ring-2 focus-within:ring-[#D14B4B] overflow-hidden">
                <div className="pl-3 text-gray-400"><Lock size={20} /></div>
                <input
                  type="password"
                  required
                  className="appearance-none bg-transparent border-none w-full text-gray-700 py-3 px-3 leading-tight focus:outline-none"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-[#D14B4B] focus:ring-[#D14B4B] border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Recuérdame
              </label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-[#D14B4B] hover:text-red-700">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-[#0D4D45] hover:bg-[#08332e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0D4D45] uppercase tracking-widest shadow-lg transform transition hover:scale-[1.02]"
            >
              Iniciar Sesión
              <span className="absolute right-0 inset-y-0 flex items-center pr-3">
                <ArrowRight size={16} className="text-[#F3E3C2]" />
              </span>
            </button>
          </div>
        </form>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="font-bold text-[#FF8F3A] hover:text-[#e67e2f]">
              Crear Cuenta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;