import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Code, Users, Award, GitBranch, Terminal, Zap } from 'lucide-react';

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
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  const animatedTexts = [
    'Desde cero hasta profesional',
    'Proyectos Reales',
    'Mentores Expertos',
    'Certificación Oficial'
  ];

  useEffect(() => {
    const fetchHeaderSection = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${import.meta.env.VITE_API_URL}/header-sections`);
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data.status === 'success' && data.data && Array.isArray(data.data) && data.data.length > 0) {
          setHeaderSection(data.data[0]);
        } else {
          setHeaderSection(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setHeaderSection(null);
      } finally {
        setLoading(false);
      }
    };

    fetchHeaderSection();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % animatedTexts.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Datos por defecto
  const defaultData = {
    title: "Aprende Desarrollo Web",
    slogan: "Desde cero hasta profesional",
    about: "Domina las tecnologías más demandadas del mercado con nuestros cursos prácticos y proyectos reales.",
    buttonName: "Comenzar Ahora",
    buttonLink: "/courses",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80"
  };

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
      <section className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden">
        <div className="relative z-10 container mx-auto px-6 pt-32 pb-20 flex items-center justify-center min-h-screen">
          <div className="animate-pulse text-center"></div>
            <div className="h-12 bg-slate-200 rounded-2xl w-96 mx-auto mb-4"></div>
            <div className="h-6 bg-slate-200 rounded-xl w-64 mx-auto mb-8"></div>
            <div className="h-4 bg-slate-200 rounded-lg w-80 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23e2e8f0" fill-opacity="0.3"%3E%3Ccircle cx="10" cy="10" r="1"/%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3Ccircle cx="50" cy="50" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
      
      {/* Floating Code Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-slate-300/20 font-mono text-sm select-none"
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              delay: i * 3,
            }}
            style={{
              left: `${5 + i * 12}%`,
              top: `${10 + i * 8}%`,
            }}
          >
            {['const', 'function', 'class', 'import', 'export', 'return', 'async', 'await'][i]}
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[85vh]">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          ></motion.div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full px-4 py-2 text-slate-600 shadow-sm"
            >
              <Award className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-medium">Certificación Profesional</span>
            </motion.div>

            {/* Main Title */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-tight">
                {heroData.title.split(' ').map((word, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className={index === 1 ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600' : ''}
                  >
                    {word}{' '}
                  </motion.span>
                ))}
              </h1>
              
              {/* Animated Subtitle */}
              <div className="text-xl md:text-2xl lg:text-3xl text-slate-600 h-16 flex items-center">
                <motion.span
                  key={currentTextIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="font-medium bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
                >
                  {currentTextIndex === 0 ? heroData.slogan : animatedTexts[currentTextIndex]}
                </motion.span>
              </div>
            </div>

            {/* Description */}
            <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
              {heroData.about}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.a
                href={heroData.buttonLink}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex items-center justify-center px-8 py-4 bg-slate-900 text-white font-semibold rounded-2xl hover:bg-slate-800 transition-all duration-300 shadow-lg shadow-slate-900/25"
              >
                <span>{heroData.buttonName}</span>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.a>

              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex items-center justify-center px-8 py-4 bg-white border border-slate-200 text-slate-700 font-semibold rounded-2xl hover:bg-slate-50 transition-all duration-300 shadow-sm"
              >
                <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform text-slate-600" />
                <span>Ver Demo</span>
              </motion.button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-center"
              >
                <div className="text-2xl md:text-3xl font-bold text-slate-900">50+</div>
                <div className="text-sm text-slate-600">Cursos</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="text-center"
              >
                <div className="text-2xl md:text-3xl font-bold text-slate-900">10K+</div>
                <div className="text-sm text-slate-600">Estudiantes</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="text-center"
              >
                <div className="text-2xl md:text-3xl font-bold text-slate-900">95%</div>
                <div className="text-sm text-slate-600">Satisfacción</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Content - Modern Code Editor */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Code Editor Window */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl shadow-slate-900/10 overflow-hidden">
                {/* Window Header */}
                <div className="flex items-center space-x-2 px-6 py-4 bg-slate-50 border-b border-slate-200">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="flex-1 flex justify-center"></div>
                    <div className="flex items-center space-x-2 bg-white px-3 py-1 rounded-lg border border-slate-200">
                      <Terminal className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-600 font-mono">main.tsx</span>
                    </div>
                  </div>
                </div>

                {/* Code Content */}
                <div className="p-6 font-mono text-sm space-y-3 bg-slate-50/50">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.0 }}
                    className="flex items-center space-x-2"
                  >
                    <span className="text-slate-400">1</span>
                    <span className="text-purple-600">import</span>
                    <span className="text-blue-600">React</span>
                    <span className="text-slate-600">from</span>
                    <span className="text-green-600">'react'</span>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 }}
                    className="flex items-center space-x-2"
                  >
                    <span className="text-slate-400">2</span>
                    <span className="text-purple-600">import</span>
                    <span className="text-blue-600">{'{ useState }'}</span>
                    <span className="text-slate-600">from</span>
                    <span className="text-green-600">'react'</span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.4 }}
                    className="flex items-center space-x-2"
                  >
                    <span className="text-slate-400">3</span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.6 }}
                    className="flex items-center space-x-2"
                  >
                    <span className="text-slate-400">4</span>
                    <span className="text-blue-600">function</span>
                    <span className="text-yellow-600">App</span>
                    <span className="text-slate-600">() {'{'}</span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.8 }}
                    className="flex items-center space-x-2"
                  >
                    <span className="text-slate-400">5</span>
                    <span className="text-slate-600 ml-4">const [count, setCount] =</span>
                    <span className="text-purple-600">useState</span>
                    <span className="text-slate-600">(0)</span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 2.0 }}
                    className="flex items-center space-x-2"
                  ></motion.div>
                    <span className="text-slate-400">6</span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 2.2 }}
                    className="flex items-center space-x-2"
                  >
                    <span className="text-slate-400">7</span>
                    <span className="text-slate-600 ml-4">return (</span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 2.4 }}
                    className="flex items-center space-x-2"
                  ></motion.div>
                    <span className="text-slate-400">8</span>
                    <span className="text-red-600 ml-8">&lt;div</span>
                    <span className="text-blue-600">className</span>
                    <span className="text-slate-600">=</span>
                    <span className="text-green-600">"app"</span>
                    <span className="text-red-600">&gt;</span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 2.6 }}
                    className="flex items-center space-x-2"
                  ></motion.div>
                    <span className="text-slate-400">9</span>
                    <span className="text-red-600 ml-12">&lt;h1&gt;</span>
                    <span className="text-slate-900">¡Hola DevProject!</span>
                    <span className="text-red-600">&lt;/h1&gt;</span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 2.8 }}
                    className="flex items-center space-x-2"
                  ></motion.div>
                    <span className="text-slate-400">10</span>
                    <span className="text-red-600 ml-8">&lt;/div&gt;</span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 3.0 }}
                    className="flex items-center space-x-2"
                  ></motion.div>
                    <span className="text-slate-400">11</span>
                    <span className="text-slate-600 ml-4">)</span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 3.2 }}
                    className="flex items-center space-x-2"
                  ></motion.div>
                    <span className="text-slate-400">12</span>
                    <span className="text-slate-600">{'}'}</span>
                  </motion.div>
                </div>
              </div>

              {/* Floating Tech Icons */}
              <motion.div
                animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-lg border border-slate-200"
              >
                <Code className="w-6 h-6 text-blue-600" />
              </motion.div>

              <motion.div
                animate={{ y: [10, -10, 10], rotate: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-lg border border-slate-200"
              ></motion.div>
                <GitBranch className="w-6 h-6 text-emerald-600" />
              </motion.div>

              <motion.div
                animate={{ y: [-5, 5, -5], rotate: [0, 3, 0] }}
                transition={{ duration: 5, repeat: Infinity, delay: 2 }}
                className="absolute top-1/2 -right-12 bg-white p-3 rounded-xl shadow-lg border border-slate-200"
              >
                <Zap className="w-5 h-5 text-yellow-500" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tech Stack Pills */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="relative z-10 pb-16"
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <p className="text-slate-600 font-medium">Tecnologías que aprenderás</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {['React', 'TypeScript', 'Node.js', 'Next.js', 'PostgreSQL', 'Docker'].map((tech, index) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.7 + index * 0.1 }}
                className="bg-white border border-slate-200 rounded-full px-4 py-2 text-sm font-medium text-slate-700 shadow-sm"
              >
                {tech}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;