import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Code, Users, Award, GitBranch, Star, Coffee, Zap } from 'lucide-react';

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
    'Code. Learn. Build.',
    'From Zero to Hero',
    'Real Projects',
    'Expert Mentorship'
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
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Datos por defecto
  const defaultData = {
    title: "Build Your Code Journey",
    slogan: "Code. Learn. Build.",
    about: "Master modern web development with hands-on projects, expert guidance, and real-world experience.",
    buttonName: "Start Coding",
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
      <section className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
        <div className="relative z-10 container mx-auto px-6 pt-32 pb-20 flex items-center justify-center min-h-screen">
          <div className="animate-pulse text-center">
            <div className="h-12 bg-slate-200 rounded-xl w-96 mx-auto mb-4"></div>
            <div className="h-6 bg-slate-200 rounded-lg w-64 mx-auto mb-8"></div>
            <div className="h-4 bg-slate-200 rounded-lg w-80 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046 8.954-20 20-20s20 8.954 20 20-8.954 20-20 20-20-8.954-20-20zm0-20c-11.046 0-20 8.954-20 20s8.954 20 20 20 20-8.954 20-20-8.954-20-20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Floating Code Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-6xl opacity-10 text-indigo-300 font-mono"
            animate={{
              x: [0, 100 + i * 20, 0],
              y: [0, -80 - i * 15, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 15 + i * 3,
              repeat: Infinity,
              delay: i * 2,
              ease: "linear"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          >
            {['</', '/>', '{}', '[]', '()', '=>', '&&', '||'][i]}
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-screen">
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
              className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-indigo-200 rounded-full px-4 py-2 text-indigo-700 shadow-lg"
            >
              <GitBranch className="w-4 h-4" />
              <span className="text-sm font-medium">Professional Developer Path</span>
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
            </motion.div>

            {/* Main Title */}
            <div className="space-y-6">
              <motion.h1 
                className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                  {heroData.title}
                </span>
              </motion.h1>
              
              {/* Animated Subtitle */}
              <div className="text-2xl md:text-3xl lg:text-4xl text-slate-600 h-16 flex items-center font-bold">
                <motion.span
                  key={currentTextIndex}
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 1.2 }}
                  transition={{ duration: 0.6, ease: "backOut" }}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"
                >
                  {currentTextIndex === 0 ? heroData.slogan : animatedTexts[currentTextIndex]}
                </motion.span>
              </div>
            </div>

            {/* Description */}
            <motion.p 
              className="text-xl text-slate-600 leading-relaxed max-w-xl font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {heroData.about}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.a
                href={heroData.buttonLink}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl"
              >
                <span>{heroData.buttonName}</span>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.a>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group inline-flex items-center justify-center px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-white hover:border-indigo-300 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Watch Demo</span>
              </motion.button>
            </motion.div>

            {/* Tech Stack Icons */}
            <motion.div 
              className="flex items-center gap-4 pt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <span className="text-sm font-medium text-slate-500">Popular Technologies:</span>
              <div className="flex gap-3">
                {['React', 'Node', 'TS', 'Next'].map((tech, i) => (
                  <motion.div
                    key={tech}
                    className="px-3 py-1 bg-white/60 border border-slate-200 rounded-lg text-sm font-mono font-bold text-slate-700"
                    whileHover={{ scale: 1.1, y: -2 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                  >
                    {tech}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Enhanced Code Editor */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative transform rotate-3 hover:rotate-0 transition-transform duration-500">
              {/* Code Editor Window */}
              <div className="bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
                {/* Window Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-slate-800 border-b border-slate-700">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="text-sm text-slate-300 font-mono">portfolio.tsx</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <GitBranch className="w-4 h-4 text-slate-400" />
                    <span className="text-xs text-slate-400">main</span>
                  </div>
                </div>

                {/* Line Numbers & Code */}
                <div className="flex">
                  <div className="bg-slate-800 px-4 py-6 border-r border-slate-700">
                    {[1,2,3,4,5,6,7,8,9,10].map(num => (
                      <div key={num} className="text-slate-500 text-sm font-mono leading-6 text-right">
                        {num}
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-6 font-mono text-sm space-y-1 flex-1">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.0 }}
                      className="text-pink-400"
                    >
                      <span className="text-purple-400">import</span> <span className="text-yellow-400">React</span> <span className="text-purple-400">from</span> <span className="text-green-400">'react'</span>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2 }}
                      className="text-pink-400"
                    >
                      <span className="text-purple-400">import</span> <span className="text-yellow-400">{'{ motion }'}</span> <span className="text-purple-400">from</span> <span className="text-green-400">'framer-motion'</span>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.4 }}
                      className="text-slate-400"
                    >
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.6 }}
                      className="text-blue-400"
                    >
                      <span className="text-purple-400">const</span> <span className="text-yellow-400">Portfolio</span> <span className="text-slate-300">=</span> <span className="text-blue-400">{'() => {'}</span>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.8 }}
                      className="text-slate-300 ml-4"
                    >
                      <span className="text-purple-400">return</span> (
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2.0 }}
                      className="text-pink-400 ml-8"
                    >
                      &lt;<span className="text-blue-400">motion.div</span>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2.2 }}
                      className="text-yellow-400 ml-12"
                    >
                      <span className="text-slate-300">className=</span><span className="text-green-400">"hero-section"</span>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2.4 }}
                      className="text-yellow-400 ml-12"
                    >
                      <span className="text-slate-300">animate=</span><span className="text-blue-400">{'{{ y: 0 }}'}</span>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2.6 }}
                      className="text-pink-400 ml-8"
                    >
                      &gt;
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2.8 }}
                      className="text-slate-300 ml-12"
                    >
                      <span className="text-green-400">"Building amazing experiences"</span>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Floating Icons */}
              <motion.div
                animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-6 -right-6 bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-2xl shadow-xl"
              >
                <Code className="w-6 h-6 text-white" />
              </motion.div>

              <motion.div
                animate={{ y: [10, -10, 10], rotate: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-6 -left-6 bg-gradient-to-r from-pink-500 to-orange-500 p-4 rounded-2xl shadow-xl"
              >
                <Zap className="w-6 h-6 text-white" />
              </motion.div>

              <motion.div
                animate={{ y: [-5, 5, -5], rotate: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, delay: 2 }}
                className="absolute top-1/2 -right-4 bg-gradient-to-r from-green-500 to-teal-500 p-3 rounded-xl shadow-lg"
              >
                <Coffee className="w-5 h-5 text-white" />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-16 border-t border-slate-200"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          {[
            { icon: Code, label: 'Projects', value: '50+', color: 'from-blue-500 to-purple-600' },
            { icon: Users, label: 'Students', value: '10K+', color: 'from-purple-500 to-pink-600' },
            { icon: Award, label: 'Success Rate', value: '95%', color: 'from-pink-500 to-orange-500' },
            { icon: Star, label: 'Rating', value: '4.9', color: 'from-orange-500 to-yellow-500' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl mb-4 group-hover:shadow-xl transition-all duration-300`}>
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-black text-slate-900 mb-1">{stat.value}</div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;