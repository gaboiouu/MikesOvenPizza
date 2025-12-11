import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, User, MessageSquare, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../types';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; 

const Reservations: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    people: 2,
    message: '',
    telefono: ''
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'warning', message: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const nombreCompleto = localStorage.getItem('nombreCompleto');
    if (nombreCompleto) {
      setFormData(prev => ({ ...prev, name: nombreCompleto }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const showNotification = (type: 'success' | 'error' | 'warning', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const [horas, minutos] = formData.time.split(':').map(Number);
    if (horas < 17 || horas >= 24) {
      showNotification('warning', 'Horario de atención: 5:00 PM - 11:59 PM');
      return;
    }
    
    if (formData.people < 1) {
      showNotification('warning', 'Debe haber al menos 1 persona para la reserva');
      return;
    }
    if (formData.people > 15) {
      showNotification('warning', 'Para grupos mayores a 15 personas, comuníquese al (01) 234-5678');
      return;
    }
    
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
      showNotification('warning', 'Debes iniciar sesión para hacer una reserva');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    setLoading(true);

    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:8080/reservas/crear-reservas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({
          nombre: formData.name,
          nroPersonas: Number(formData.people),
          fecha: formData.date,
          hora: formData.time,
          mensajeAdicional: formData.message,
          telefono: formData.telefono,
          userId: Number(userId)
        })
      });

      if (!response.ok) {
        throw new Error('Error al crear la reserva');
      }

      const reservaCreada = await response.json();
      
      setLoading(false);

      const fechaFormateada = new Date(formData.date + 'T00:00:00').toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      const mensaje = 
        '🍕 *RESERVA EN MIKE\'S PIZZA* 🍕\n\n' +
        `📋 Reserva #${reservaCreada.reservaId || 'Pendiente'}\n\n` +
        `👤 *Nombre:* ${formData.name}\n` +
        `📅 *Fecha:* ${fechaFormateada}\n` +
        `⏰ *Hora:* ${formData.time}\n` +
        `👥 *Personas:* ${formData.people}\n` +
        `📞 *Teléfono:* ${formData.telefono}\n` +
        (formData.message ? `📝 *Nota:* ${formData.message}\n` : '') +
        '\n¡Gracias por elegirnos! ✨';
      
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
      
      window.open(url, '_blank');

      setFormData({
        name: '',
        date: '',
        time: '',
        people: 2,
        message: '',
        telefono: ''
      });
      
      showNotification('success', 'Reserva creada exitosamente');
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      console.error('Error:', error);
      showNotification('error', 'Error al crear la reserva. Por favor intenta nuevamente');
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

      <div className="relative min-h-screen bg-[#F3E3C2]/20 py-12 overflow-hidden">
        <motion.div
          initial={{ x: '-100vw', y: 50, rotate: -20 }}
          animate={{ x: 0, rotate: 0 }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute top-10 left-0 text-[#D14B4B] text-4xl"
        >
          🍕
        </motion.div>

        <motion.div
          initial={{ x: '100vw', y: 200, rotate: 20 }}
          animate={{ x: 0, rotate: 0 }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute bottom-20 right-0 text-[#FF8F3A] text-4xl"
        >
          🍕
        </motion.div>

        <motion.div
          initial={{ y: '-100vh', x: 150, rotate: 15 }}
          animate={{ y: 0, rotate: 0 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute top-0 left-1/2 text-[#0D4D45] text-4xl"
        >
          🍕
        </motion.div>

        <motion.div
          initial={{ x: '120vw', y: 100, rotate: -15 }}
          animate={{ x: 0, rotate: 0 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute top-40 right-0 text-[#FACC15] text-4xl"
        >
          🍕
        </motion.div>

        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-[#0D4D45] py-8 px-8 text-center">
              <h1 className="text-3xl font-bold text-white uppercase tracking-widest">Reserva tu Mesa</h1>
              <p className="text-[#F3E3C2] mt-2">Asegura tu lugar en Mike's Oven Pizza</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase">
                    <User size={16} className="text-[#D14B4B]" /> Nombre
                  </label>
                  <input
                    required
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-[#D14B4B] transition-colors"
                    placeholder="Nombre del titular de la reserva"
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase">
                    <Users size={16} className="text-[#D14B4B]" /> Nro. Personas
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    max="20"
                    name="people"
                    value={formData.people}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-[#D14B4B] transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase">
                    <Calendar size={16} className="text-[#D14B4B]" /> Fecha
                  </label>
                  <input
                    required
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-[#D14B4B] transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase">
                    <Clock size={16} className="text-[#D14B4B]" /> Hora
                  </label>
                  <input
                    required
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-[#D14B4B] transition-colors"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase">
                  📞 Teléfono
                </label>
                <input
                  required
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-[#D14B4B] transition-colors"
                  placeholder="+51 999 999 999"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase">
                  <MessageSquare size={16} className="text-[#D14B4B]" /> Mensaje Adicional
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-[#D14B4B] transition-colors"
                  placeholder="¿Alguna alergia o celebración especial?"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 rounded-lg uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? '⏳ Procesando...' : '✅ Confirmar por WhatsApp'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Reservations;
