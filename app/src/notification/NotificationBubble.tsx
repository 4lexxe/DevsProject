import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";
import { Howl } from "howler";
import { useAuth } from "../auth/contexts/AuthContext";
import notificationSoundPath from "../shared/assets/sounds/notification.wav";

let notificationSound: Howl | null = null;

const NotificationBubble = () => {
  const { showWelcomeMessage, setShowWelcomeMessage, user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  useEffect(() => {
    const enableAudioContext = () => {
      setUserInteracted(true);

      if (!notificationSound) {
        notificationSound = new Howl({
          src: [notificationSoundPath],
          volume: 0.5,
          html5: true,
        });
      }

      window.removeEventListener("click", enableAudioContext);
      window.removeEventListener("keydown", enableAudioContext);
    };

    window.addEventListener("click", enableAudioContext);
    window.addEventListener("keydown", enableAudioContext);

    return () => {
      window.removeEventListener("click", enableAudioContext);
      window.removeEventListener("keydown", enableAudioContext);
    };
  }, []);

  useEffect(() => {
    if (showWelcomeMessage && user) {
      setIsVisible(true);

      if (userInteracted && notificationSound) {
        notificationSound.play();
      }

      const timer = setTimeout(() => {
        setIsVisible(false);
        setShowWelcomeMessage(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showWelcomeMessage, setShowWelcomeMessage, user, userInteracted]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20,
            duration: 0.5,
          }}
          className="fixed top-20 inset-x-0 mx-auto z-50 px-4 sm:px-6 md:px-8 max-w-md"
        >
          <div className="flex items-center gap-3 p-4 bg-white/90 backdrop-blur-md border border-gray-200 rounded-lg shadow-lg dark:bg-gray-900/90 dark:border-gray-800">
            <div className="flex-shrink-0">
              <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </div>
            <p className="flex-1 text-sm font-medium text-gray-800 dark:text-gray-200 break-words">
              ¡Bienvenido! Has iniciado sesión correctamente
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationBubble;