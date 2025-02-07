import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Howl } from "howler";
import { useAuth } from "../auth/contexts/AuthContext";
import notificationSoundPath from "../shared/assets/sounds/notification.wav";

// Cargar sonido de notificación
const notificationSound = new Howl({
  src: [notificationSoundPath],
  volume: 0.5,
});

const NotificationBubble = () => {
  const { showWelcomeMessage, setShowWelcomeMessage, socket } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (showWelcomeMessage && socket) {
      setIsVisible(true);
      notificationSound.play(); // Reproducir sonido solo una vez

      const timer = setTimeout(() => {
        setIsVisible(false);
        setShowWelcomeMessage(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showWelcomeMessage, setShowWelcomeMessage, socket]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed top-4 left-1/2 -translate-x-1/2 
                     bg-green-500 text-white px-6 py-3 rounded-full 
                     shadow-lg z-50"
        >
          🎉 ¡Bienvenido! Has iniciado sesión correctamente
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationBubble;