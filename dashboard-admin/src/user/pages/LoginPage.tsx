import { motion } from 'framer-motion'
import LoginForm from "../components/login/LoginForm";

function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Fondo animado con gradientes */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Círculos animados de fondo con movimiento continuo */}
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 150, 100, 50, 0],
            y: [0, 80, 120, 60, 0],
            scale: [1, 1.3, 1.1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -120, -80, -150, 0],
            y: [0, -100, -60, -120, 0],
            scale: [1, 1.4, 1.2, 1.3, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, -50, 80, 0],
            y: [0, -120, -80, -100, 0],
            scale: [1, 1.2, 1.1, 1.15, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        
        {/* Partículas flotantes adicionales */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-48 h-48 bg-cyan-500/8 rounded-full blur-2xl"
          animate={{
            x: [0, 80, -40, 60, 0],
            y: [0, -60, 40, -80, 0],
            scale: [1, 1.15, 1.05, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute bottom-1/3 left-1/3 w-56 h-56 bg-pink-500/8 rounded-full blur-2xl"
          animate={{
            x: [0, -70, 50, -90, 0],
            y: [0, 90, -50, 70, 0],
            scale: [1, 1.2, 1.1, 1.15, 1],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        
        {/* Patrón de grid animado */}
        <motion.div
          className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-40"
          animate={{
            opacity: [0.3, 0.5, 0.4, 0.45, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Líneas de movimiento */}
        <motion.div
          className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"
          animate={{
            x: ['200%', '-100%'],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Contenido */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo y Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6 flex justify-center"
          >
            <img
              src="https://i.ibb.co/dQ09SsH/logoDev2.png"
              alt="Logo"
              className="h-16 w-auto object-contain"
            />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold text-white mb-2"
          >
            Bienvenido de vuelta
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-400"
          >
            Inicia sesión para acceder al panel de administración
          </motion.p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white/5 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/10 dark:border-gray-700/50"
        >
          <LoginForm />
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center mt-6 text-sm text-gray-400"
        >
          <p>© 2024 LMS Platform. Todos los derechos reservados.</p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default LoginPage;
