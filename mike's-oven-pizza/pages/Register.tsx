import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Mail, ArrowRight, Pizza, CheckCircle, XCircle, Check, X } from 'lucide-react';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nombreCompleto, setNombreCompleto] = useState('');
  
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  
  const navigate = useNavigate();

  const passwordValidations = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  const isPasswordValid = Object.values(passwordValidations).every(v => v);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    setEmailError('');
    setPasswordError('');
    setGeneralError('');
    setSuccessMessage('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Por favor ingresa un correo electrónico válido');
      return;
    }

    if (!isPasswordValid) {
      setPasswordError('La contraseña no cumple con todos los requisitos de seguridad');
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }

    if (nombreCompleto.trim().length < 3) {
      setGeneralError('El nombre debe tener al menos 3 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8080/users/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password,
          nombreCompleto: nombreCompleto,
          rol: 'CLIENTE'
        })
      });

      if (response.ok) {
        const user = await response.json();
        setSuccessMessage('✅ Cuenta creada exitosamente. Redirigiendo...');
        
        localStorage.removeItem('cart');
        localStorage.removeItem('favoritos');
        
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        const error = await response.json();
        
        if (error.message?.includes('correo') || error.message?.includes('email')) {
          setEmailError(error.message || 'Este correo ya está registrado');
        } else if (error.message?.includes('contraseña') || error.message?.includes('password')) {
          setPasswordError(error.message || 'Error en la contraseña');
        } else {
          setGeneralError(error.message || 'Error al crear la cuenta. Intenta nuevamente.');
        }
      }
    } catch (error) {
      setGeneralError('No se pudo conectar con el servidor. Verifica tu conexión.');
    } finally {
      setIsLoading(false);
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

        {successMessage && (
          <div className="mt-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg animate-pulse">
            <div className="flex items-center">
              <CheckCircle className="text-green-500 mr-3" size={24} />
              <p className="text-sm font-semibold text-green-800">{successMessage}</p>
            </div>
          </div>
        )}

        {generalError && (
          <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <div className="flex items-center">
              <XCircle className="text-red-500 mr-3" size={24} />
              <p className="text-sm font-semibold text-red-800">{generalError}</p>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-4" onSubmit={handleRegister}>
          
          <div className="relative">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">
              Nombre Completo
            </label>
            <div className="flex items-center border rounded-lg bg-gray-50 focus-within:ring-2 focus-within:ring-[#0D4D45] overflow-hidden">
              <div className="pl-3 text-gray-400"><User size={20} /></div>
              <input
                type="text"
                value={nombreCompleto}
                onChange={e => setNombreCompleto(e.target.value)}
                className="appearance-none bg-transparent border-none w-full text-gray-700 py-3 px-3 leading-tight focus:outline-none"
                placeholder="Mike Torres"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="relative">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">
              Correo Electrónico
            </label>
            <div className={`flex items-center border rounded-lg bg-gray-50 overflow-hidden transition-all
              ${emailError 
                ? 'border-red-500 ring-2 ring-red-200' 
                : 'focus-within:ring-2 focus-within:ring-[#0D4D45]'
              }`}>
              <div className="pl-3 text-gray-400"><Mail size={20} /></div>
              <input
                type="email"
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                  setEmailError('');
                }}
                className="appearance-none bg-transparent border-none w-full text-gray-700 py-3 px-3 leading-tight focus:outline-none"
                placeholder="mike@pizza.com"
                required
                disabled={isLoading}
              />
            </div>
            {emailError && (
              <div className="flex items-center mt-1 ml-1">
                <XCircle size={14} className="text-red-500 mr-1" />
                <p className="text-xs text-red-600 font-semibold">{emailError}</p>
              </div>
            )}
          </div>

          <div className="relative">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">
              Contraseña
            </label>
            <div className={`flex items-center border rounded-lg bg-gray-50 overflow-hidden transition-all
              ${passwordError 
                ? 'border-red-500 ring-2 ring-red-200' 
                : 'focus-within:ring-2 focus-within:ring-[#0D4D45]'
              }`}>
              <div className="pl-3 text-gray-400"><Lock size={20} /></div>
              <input
                type="password"
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  setPasswordError('');
                }}
                onFocus={() => setShowPasswordRequirements(true)}
                className="appearance-none bg-transparent border-none w-full text-gray-700 py-3 px-3 leading-tight focus:outline-none"
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
            </div>

            {showPasswordRequirements && password.length > 0 && (
              <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs font-bold text-gray-700 mb-2">Requisitos de seguridad:</p>
                <div className="space-y-1">
                  <div className="flex items-center">
                    {passwordValidations.minLength ? (
                      <Check size={14} className="text-green-500 mr-2" />
                    ) : (
                      <X size={14} className="text-red-500 mr-2" />
                    )}
                    <p className={`text-xs ${passwordValidations.minLength ? 'text-green-600' : 'text-gray-600'}`}>
                      Mínimo 8 caracteres
                    </p>
                  </div>
                  <div className="flex items-center">
                    {passwordValidations.hasUpperCase ? (
                      <Check size={14} className="text-green-500 mr-2" />
                    ) : (
                      <X size={14} className="text-red-500 mr-2" />
                    )}
                    <p className={`text-xs ${passwordValidations.hasUpperCase ? 'text-green-600' : 'text-gray-600'}`}>
                      Una letra mayúscula (A-Z)
                    </p>
                  </div>
                  <div className="flex items-center">
                    {passwordValidations.hasLowerCase ? (
                      <Check size={14} className="text-green-500 mr-2" />
                    ) : (
                      <X size={14} className="text-red-500 mr-2" />
                    )}
                    <p className={`text-xs ${passwordValidations.hasLowerCase ? 'text-green-600' : 'text-gray-600'}`}>
                      Una letra minúscula (a-z)
                    </p>
                  </div>
                  <div className="flex items-center">
                    {passwordValidations.hasNumber ? (
                      <Check size={14} className="text-green-500 mr-2" />
                    ) : (
                      <X size={14} className="text-red-500 mr-2" />
                    )}
                    <p className={`text-xs ${passwordValidations.hasNumber ? 'text-green-600' : 'text-gray-600'}`}>
                      Un número (0-9)
                    </p>
                  </div>
                  <div className="flex items-center">
                    {passwordValidations.hasSpecialChar ? (
                      <Check size={14} className="text-green-500 mr-2" />
                    ) : (
                      <X size={14} className="text-red-500 mr-2" />
                    )}
                    <p className={`text-xs ${passwordValidations.hasSpecialChar ? 'text-green-600' : 'text-gray-600'}`}>
                      Un carácter especial (!@#$%^&*)
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">
              Confirmar Contraseña
            </label>
            <div className={`flex items-center border rounded-lg bg-gray-50 overflow-hidden transition-all
              ${passwordError 
                ? 'border-red-500 ring-2 ring-red-200' 
                : 'focus-within:ring-2 focus-within:ring-[#0D4D45]'
              }`}>
              <div className="pl-3 text-gray-400"><Lock size={20} /></div>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => {
                  setConfirmPassword(e.target.value);
                  setPasswordError('');
                }}
                className="appearance-none bg-transparent border-none w-full text-gray-700 py-3 px-3 leading-tight focus:outline-none"
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
            </div>
            {passwordError && (
              <div className="flex items-center mt-1 ml-1">
                <XCircle size={14} className="text-red-500 mr-1" />
                <p className="text-xs text-red-600 font-semibold">{passwordError}</p>
              </div>
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white 
                ${isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-[#0D4D45] hover:bg-[#08332e] hover:scale-[1.02]'
                } 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0D4D45] uppercase tracking-widest shadow-lg transform transition`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creando cuenta...
                </>
              ) : (
                <>
                  Crear Cuenta
                  <span className="absolute right-0 inset-y-0 flex items-center pr-3">
                    <ArrowRight size={16} className="text-white" />
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="font-bold text-[#0D4D45] hover:text-[#08332e] hover:underline">
              Inicia Sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;