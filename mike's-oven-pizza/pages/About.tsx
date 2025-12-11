import React, { useEffect, useRef, useState } from 'react';
import { Target, Eye, Users, Lightbulb, Home, Flame, MapPin, Leaf } from 'lucide-react';

const About: React.FC = () => {
  const values = [
    {
      icon: <Users size={32} />,
      title: 'Trabajo en equipo',
      desc: 'Creemos en la unión de nuestro equipo como clave para ofrecer un servicio rápido, amable y de calidad.',
      color: 'bg-blue-500'
    },
    {
      icon: <Target size={32} />, 
      title: 'Calidad',
      desc: 'Usamos ingredientes frescos y cuidamos cada detalle en la preparación para garantizar una experiencia única.',
      color: 'bg-[#D14B4B]'
    },
    {
      icon: <Lightbulb size={32} />,
      title: 'Innovación',
      desc: 'Nos diferenciamos con propuestas creativas en pizzas y platos especiales que sorprenden a nuestros clientes.',
      color: 'bg-[#FF8F3A]'
    },
    {
      icon: <Home size={32} />,
      title: 'Hospitalidad',
      desc: 'Tratamos a cada cliente como parte de nuestra familia, brindando un ambiente acogedor y cercano.',
      color: 'bg-[#0D4D45]'
    },
    {
      icon: <Flame size={32} />,
      title: 'Pasión por el servicio',
      desc: 'Amamos lo que hacemos y buscamos que cada visita se convierta en un momento especial.',
      color: 'bg-red-600'
    },
    {
      icon: <MapPin size={32} />,
      title: 'Compromiso con la comunidad',
      desc: 'Valoramos nuestra ciudad y su turismo, aportando al desarrollo local y promoviendo experiencias culturales.',
      color: 'bg-indigo-600'
    },
    {
      icon: <Leaf size={32} />,
      title: 'Sensibilidad',
      desc: 'Reducimos desperdicios y utilizamos empaques responsables con el medio ambiente.',
      color: 'bg-green-600'
    }
  ];

  const animateRefs = useRef<HTMLDivElement[]>([]);
  const [visible, setVisible] = useState<boolean[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const index = Number(entry.target.getAttribute("data-index"));
          if (entry.isIntersecting) {
            setVisible(prev => {
              const updated = [...prev];
              updated[index] = true;
              return updated;
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    animateRefs.current.forEach((ref) => ref && observer.observe(ref));
    return () => observer.disconnect();
  }, []);

  const animClass = (idx: number) =>
    `transition-all duration-[900ms] ease-out ${
      visible[idx] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
    }`;

  return (
    <div className="bg-white font-sans">

      <div
        data-index={0}
        ref={(el) => (animateRefs.current[0] = el!)}
        className={animClass(0)}
      >
        <div className="relative bg-[#0D4D45] text-white py-24 text-center overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="relative z-10 px-4">
            <h1 className="text-5xl font-extrabold uppercase tracking-widest mb-4 font-montserrat animate-fade-in-up">
              Nuestra Historia
            </h1>
            <p className="text-[#F3E3C2] text-xl max-w-2xl mx-auto font-light">
              Desde Nuevo Chimbote para el mundo. Pasión, sabor y tradición desde 2020.
            </p>
          </div>
        </div>
      </div>


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        <div
          data-index={1}
          ref={(el) => (animateRefs.current[1] = el!)}
          className={animClass(1)}
        >
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-24 flex flex-col lg:flex-row border border-gray-100">

            <div className="lg:w-1/2 p-10 lg:p-16 flex flex-col justify-center bg-white">
              <span className="text-[#D14B4B] font-bold uppercase tracking-widest text-sm flex items-center gap-2 mb-6">
                <span className="w-8 h-1 bg-[#D14B4B]"></span> Origen
              </span>

              <h2 className="text-4xl font-extrabold text-[#1A1A1A] leading-tight mb-6">
                EL SABOR DE <br/><span className="text-[#0D4D45]">NUEVO CHIMBOTE</span>
              </h2>

              <div className="text-gray-600 space-y-6 text-lg leading-relaxed text-justify">
                <p>
                  <strong>Mike’s Oven Pizza</strong> nació en 2022 en Nuevo Chimbote con una misión clara: especializarse en la elaboración de pizzas artesanales y platos innovadores.
                </p>
                <p>
                  Nuestra propuesta combina insumos frescos, procesos estandarizados y un ambiente acogedor. Ofrecemos a nuestros clientes una experiencia gastronómica diferenciada, ya sea en nuestro salón o a través de nuestro servicio de delivery.
                </p>
                <p>
                  Hoy, buscamos consolidar nuestro crecimiento ampliando nuestra infraestructura y fortaleciendo nuestra presencia digital, siempre manteniendo la calidez que nos caracteriza.
                </p>
              </div>
            </div>

            <div className="lg:w-1/2 relative h-96 lg:h-auto">
              <img 
                src="https://images.unsplash.com/photo-1585238342024-78d387f4a707?q=80&w=800&auto=format&fit=crop" 
                alt="Pizza Artesanal"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent lg:bg-gradient-to-l"></div>
            </div>

          </div>
        </div>


        <div
          data-index={2}
          ref={(el) => (animateRefs.current[2] = el!)}
          className={animClass(2)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">

            <div className="relative group overflow-hidden rounded-2xl shadow-xl">
              <div className="absolute inset-0 bg-[#0D4D45] transition-transform duration-500 group-hover:scale-105"></div>
              <div className="relative p-10 text-white h-full flex flex-col justify-center text-center">
                <div className="bg-[#F3E3C2] text-[#0D4D45] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Target size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-4 uppercase tracking-wider">Misión</h3>
                <p className="text-[#F3E3C2] italic text-lg leading-relaxed">
                  Brindar a jóvenes y familias una experiencia gastronómica única, ofreciendo pizzas
                  artesanales y platos especiales que combinan sabor, innovación y un servicio cercano.
                </p>
              </div>
            </div>

            <div className="relative group overflow-hidden rounded-2xl shadow-xl">
              <div className="absolute inset-0 bg-[#1A1A1A] transition-transform duration-500 group-hover:scale-105"></div>
              <div className="relative p-10 text-white h-full flex flex-col justify-center text-center">
                <div className="bg-[#FF8F3A] text-[#1A1A1A] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Eye size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-4 uppercase tracking-wider">Visión</h3>
                <p className="text-gray-300 italic text-lg leading-relaxed">
                  Convertirse en la pizzería–restaurante preferido de la ciudad, reconocida por su
                  calidad, variedad y ambiente acogedor, con proyección a expandirse a otras zonas.
                </p>
              </div>
            </div>

          </div>
        </div>


        <div
          data-index={3}
          ref={(el) => (animateRefs.current[3] = el!)}
          className={animClass(3)}
        >
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-extrabold text-[#1A1A1A] uppercase inline-block border-b-4 border-[#0D4D45] pb-2">
              Nuestros Valores
            </h2>
            <p className="mt-4 text-gray-500">Los pilares que sostienen cada experiencia en Mike's Oven Pizza.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val, idx) => (
              <div 
                key={idx}
                className="bg-white border border-gray-100 p-6 rounded-xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className={`w-12 h-12 rounded-lg ${val.color} text-white flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                  {val.icon}
                </div>
                <h4 className="text-lg font-bold text-[#1A1A1A] mb-2 uppercase">{val.title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
