import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Code, GitBranch, Star, Zap } from 'lucide-react';

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
  const [e setError] = useState<string | null>(null);
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
      <section className="relative min-h-[60vh] bg-white overflow-hidden">
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-12 flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse text-center">
            <div className="h-6 sm:h-8 bg-gray-200 rounded-lg w-48 sm:w-72 mx-auto mb-3"></div>
            <div className="h-3 sm:h-4 bg-gray-200 rounded w-32 sm:w-48 mx-auto mb-4"></div>
            <div className="h-2 sm:h-3 bg-gray-200 rounded w-40 sm:w-56 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-[65vh] bg-white overflow-hidden">
      {/* Animated Background Pattern - More subtle */}
      <div className="absolute inset-0 opacity-5 sm:opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046 8.954-20 20-20s20 8.954 20 20-8.954 20-20 20-20-8.954-20-20zm0-20c-11.046 0-20 8.954-20 20s8.954 20 20 20 20-8.954 20-20-8.954-20-20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Floating Code Elements - Reduced */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl sm:text-3xl opacity-5 text-indigo-400 font-mono"
            animate={{
              x: [0, 25 + i * 6, 0],
              y: [0, -25 - i * 4, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 12 + i * 3,
              repeat: Infinity,
              delay: i * 2,
              ease: "linear"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          >
            {['</', '{}', '=>'][i]}
          </motion.div>
        ))}
      </div>

      {/* Main Content - More compact */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-8 sm:pb-12">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center min-h-[55vh]">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4 sm:space-y-6 text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 text-gray-700 shadow-sm text-xs"
            >
              <GitBranch className="w-3 h-3" />
              <span className="font-medium">Developer Path</span>
              <Star className="w-3 h-3 text-yellow-500 fill-current" />
            </motion.div>

            {/* Main Title */}
            <div className="space-y-3 sm:space-y-4">
              <motion.h1 
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                  {heroData.title}
                </span>
              </motion.h1>
              
              {/* Animated Subtitle */}
              <div className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 h-8 sm:h-10 flex items-center justify-center lg:justify-start font-bold">
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
              className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed max-w-lg mx-auto lg:mx-0 font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {heroData.about}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.a
                href={heroData.buttonLink}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group inline-flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl text-sm"
              >
                <span>{heroData.buttonName}</span>
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.a>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group inline-flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:border-indigo-300 transition-all duration-300 shadow-md hover:shadow-lg text-sm"
              >
                <Play className="mr-2 w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Demo</span>
              </motion.button>
            </motion.div>

            {/* Tech Stack Icons */}
            <motion.div 
              className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 pt-4 sm:pt-6 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <span className="text-xs font-medium text-gray-500">Tech Stack:</span>
              <div className="flex gap-2">
                {['React', 'Node', 'TS', 'Next'].map((tech, i) => (
                  <motion.div
                    key={tech}
                    className="px-2 py-0.5 bg-gray-50 border border-gray-200 rounded text-xs font-mono font-bold text-gray-700"
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

          {/* Right Content - Compact Code Editor */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative order-first lg:order-last"
          >
            <div className="relative transform hover:rotate-0 lg:rotate-2 transition-transform duration-500">
              {/* Code Editor Window */}
              <div className="bg-gray-900 rounded-lg lg:rounded-xl shadow-xl overflow-hidden border border-gray-200 mx-2 sm:mx-4 lg:mx-0">
                {/* Window Header */}
                <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-800 border-b border-gray-700">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="text-xs text-gray-300 font-mono">portfolio.tsx</div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <GitBranch className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-400">main</span>
                  </div>
                </div>

                {/* Line Numbers & Code */}
                <div className="flex">
                  <div className="bg-gray-800 px-2 py-3 border-r border-gray-700">
                    {[1,2,3,4,5,6,7].map(num => (
                      <div key={num} className="text-gray-500 text-xs font-mono leading-4 text-right">
                        {num}
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-3 font-mono text-xs space-y-0.5 flex-1">
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
                      className="text-blue-400"
                    >
                      <span className="text-purple-400">const</span> <span className="text-yellow-400">App</span> <span className="text-gray-300">=</span> <span className="text-blue-400">{'() => {'}</span>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.4 }}
                      className="text-gray-300 ml-2"
                    >
                      <span className="text-purple-400">return</span> (
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.6 }}
                      className="text-pink-400 ml-4"
                    >
                      &lt;<span className="text-blue-400">div</span> <span className="text-yellow-400">className</span>=<span className="text-green-400">"app"</span>&gt;
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.8 }}
                      className="text-gray-300 ml-6"
                    >
                      <span className="text-green-400">"Hello World!"</span>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2.0 }}
                      className="text-pink-400 ml-4"
                    >
                      &lt;/<span className="text-blue-400">div</span>&gt;
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2.2 }}
                      className="text-gray-300 ml-2"
                    >
                      )
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Floating Icons - Minimal */}
              <motion.div
                animate={{ y: [-6, 6, -6], rotate: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-2 sm:-top-3 -right-2 sm:-right-3 bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg shadow-lg"
              >
                <Code className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </motion.div>

              <motion.div
                animate={{ y: [6, -6, 6], rotate: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-2 sm:-bottom-3 -left-2 sm:-left-3 bg-gradient-to-r from-pink-500 to-orange-500 p-2 rounded-lg shadow-lg"
              >
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;