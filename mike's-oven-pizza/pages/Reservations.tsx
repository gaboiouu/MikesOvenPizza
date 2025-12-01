import React, { useState } from 'react';
import { Calendar, Clock, Users, User, MessageSquare } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../types';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // <-- para animaciones

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
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await fetch('http://localhost:8080/reservas/crear-reservas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: formData.name,
        nroPersonas: Number(formData.people),
        fecha: formData.date,
        hora: formData.time,
        mensajeAdicional: formData.message,
        telefono: formData.telefono,
        userId: JSON.parse(localStorage.getItem('user') || '{}').id
      })
    });

    setLoading(false);

    const text = `Hola, quiero reservar una mesa:%0A
👤 Nombre: ${formData.name}%0A
📅 Fecha: ${formData.date}%0A
⏰ Hora: ${formData.time}%0A
👥 Personas: ${formData.people}%0A
📞 Teléfono: ${formData.telefono}%0A
📝 Nota: ${formData.message}`;
    
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');

    setFormData({
      name: '',
      date: '',
      time: '',
      people: 2,
      message: '',
      telefono: ''
    });
    navigate('/menu'); 
  };

  return (
    <div className="relative min-h-screen bg-[#F3E3C2]/20 py-12 overflow-hidden">
      {/* Pizzitas animadas alrededor */}
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
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase">
                <User size={16} className="text-[#D14B4B]" /> Teléfono
              </label>
              <input
                required
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-[#D14B4B] transition-colors"
                placeholder="Tu número de teléfono"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 rounded-lg uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
            >
              {loading ? 'Procesando...' : 'Confirmar por WhatsApp'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Reservations;
