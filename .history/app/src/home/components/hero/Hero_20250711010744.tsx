import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { ArrowRight, Play, Code, Users, Award } from 'lucide-react';

// Interfaces
interface HeaderSection {
  id: number;
  image: string;
  title: string;
  slogan: string;
  about: string;
  buttonName: string;
  buttonLink: string;
  adminId: number;
  createdAt: string;
  updatedAt: string;
}

const Hero: React.FC = () => {
  const [headerSection, setHeaderSection] = useState<HeaderSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHeaderSection = async () => {
      try {
        setLoading(true);
        setError(null);

        // Llamada a la API para obtener las secciones de header
        const response = await fetch(`${import.meta.env.VITE_API_URL}/header-sections`);
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        // Verificar que la respuesta tenga el formato esperado
        if (data.status === 'success' && data.data && Array.isArray(data.data) && data.data.length > 0) {
          setHeaderSection(data.data[0]); // Tomar la primera sección
        } else {
          console.warn('No se encontraron secciones de header o formato inesperado:', data);
          setHeaderSection(null);
        }
      } catch (err) {
        console.error('Error fetching header section:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setHeaderSection(null);
      } finally {
        setLoading(false);
      }
    };

    fetchHeaderSection();
  }, []);

  // Datos por defecto si no hay datos del backend
  const defaultData = {
    title: "Aprende Desarrollo Web",
    slogan: "Desde cero hasta profesional",
    about: "Domina las tecnologías más demandadas del mercado con nuestros cursos prácticos y proyectos reales.",
    buttonName: "Comenzar Ahora",
    buttonLink: "/courses",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80"
  };

  // Usar datos del backend si están disponibles, sino usar datos por defecto
  const heroData = headerSection ? {
    title: headerSection.title || defaultData.title,
    slogan: headerSection.slogan || defaultData.slogan,
    about: headerSection.about || defaultData.about,
    buttonName: headerSection.buttonName || defaultData.buttonName,
    buttonLink: headerSection.buttonLink || defaultData.buttonLink,
    image: headerSection.image || defaultData.image
  } : defaultData;

  if (loading) {
    return (
      <section className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 container mx-auto px-6 pt-32 pb-20 flex items-center justify-center min-h-screen">
          <div className="animate-pulse text-center">
            <div className="h-12 bg-gray-700 rounded w-96 mx-auto mb-4"></div>
            <div className="h-6 bg-gray-700 rounded w-64 mx-auto mb-8"></div>
            <div className="h-4 bg-gray-700 rounded w-80 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroData.image})` }}
      />
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-indigo-400 rounded-full opacity-30"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              delay: i * 2
            }}
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + i * 10}%`
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 bg-indigo-500/20 backdrop-blur-sm border border-indigo-500/30 rounded-full px-4 py-2 text-indigo-300"
            >
              <Award className="w-4 h-4" />
              <span className="text-sm font-medium">Certificación Profesional</span>
            </motion.div>

            {/* Main Title */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                {heroData.title}
              </h1>
              
              {/* Animated Subtitle */}
              <div className="text-xl md:text-2xl lg:text-3xl text-indigo-300 h-16 flex items-center">
                <TypeAnimation
                  sequence={[
                    heroData.slogan,
                    2000,
                    'Proyectos Reales',
                    2000,
                    'Mentores Expertos',
                    2000,
                    'Certificación Oficial',
                    2000,
                  ]}
                  wrapper="span"
                  speed={50}
                  repeat={Infinity}
                  className="font-semibold"
                />
              </div>
            </div>

            {/* Description */}
            <p className="text-lg text-gray-300 leading-relaxed max-w-xl">
              {heroData.about}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.a
                href={heroData.buttonLink}
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(99, 102, 241, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-xl"
              >
                <span>{heroData.buttonName}</span>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.a>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-full hover:bg-white/20 transition-all duration-300"
              >
                <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Ver Demo</span>
              </motion.button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-center"
              >
                <div className="text-2xl md:text-3xl font-bold text-white">50+</div>
                <div className="text-sm text-gray-400">Cursos</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="text-center"
              >
                <div className="text-2xl md:text-3xl font-bold text-white">10K+</div>
                <div className="text-sm text-gray-400">Estudiantes</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="text-center"
              >
                <div className="text-2xl md:text-3xl font-bold text-white">95%</div>
                <div className="text-sm text-gray-400">Satisfacción</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Content - Code Animation */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Code Window */}
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
                {/* Window Header */}
                <div className="flex items-center space-x-2 px-4 py-3 bg-gray-800 border-b border-gray-700">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="ml-4 text-sm text-gray-400">main.tsx</div>
                </div>

                {/* Code Content */}
                <div className="p-6 font-mono text-sm space-y-2">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.0 }}
                    className="text-purple-400"
                  >
                    import <span className="text-yellow-400">React</span> from <span className="text-green-400">'react'</span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="text-blue-400"
                  >
                    function <span className="text-yellow-400">App</span>() {'{'}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4 }}
                    className="text-gray-300 ml-4"
                  >
                    return (
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.6 }}
                    className="text-pink-400 ml-8"
                  >
                    &lt;h1&gt;<span className="text-white">¡Hola Mundo!</span>&lt;/h1&gt;
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.8 }}
                    className="text-gray-300 ml-4"
                  >
                    )
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.0 }}
                    className="text-blue-400"
                  >
                    {'}'}
                  </motion.div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-4 -right-4 bg-indigo-500 p-3 rounded-xl shadow-lg"
              >
                <Code className="w-6 h-6 text-white" />
              </motion.div>

              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-4 -left-4 bg-purple-500 p-3 rounded-xl shadow-lg"
              >
                <Users className="w-6 h-6 text-white" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Error Message (solo en desarrollo) */}
      {error && process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50">
          <p className="text-sm">Error cargando header: {error}</p>
        </div>
      )}
    </section>
  );
};

export default Hero;