import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";
import { Howl } from "howler";
import { useAuth } from "../auth/contexts/AuthContext";

const notificationSoundPath = "/notification.wav";

let notificationSound: Howl | null = null;

const NotificationBubble = () => {
  const { showWelcomeMessage, setShowWelcomeMessage, user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  const name = user?.name || "Usuario";
  const welcomeText = `¡Bienvenido ${name}!`;

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

      const expandTimer = setTimeout(() => {
        setIsExpanded(true);
      }, 1000);

      const closeTimer = setTimeout(() => {
        setIsExpanded(false);
        setTimeout(() => {
          setIsVisible(false);
          setShowWelcomeMessage(false);
        }, 500);
      }, 5000);

      return () => {
        clearTimeout(expandTimer);
        clearTimeout(closeTimer);
      };
    }
  }, [showWelcomeMessage, setShowWelcomeMessage, user, userInteracted]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {/* Círculo de pulso exterior */}
          <motion.div
            variants={{
              initial: {
                scale: 0.8,
                opacity: 0,
                x: "-50%",
              },
              animate: {
                scale: [1, 1.2, 1],
                opacity: [0, 0.5, 0],
                x: "-50%",
                transition: {
                  duration: 1,
                  times: [0, 0.5, 1],
                  repeat: isExpanded ? 0 : Infinity,
                  repeatType: "reverse",
                },
              },
              exit: {
                scale: 0.8,
                opacity: 0,
                x: "-50%",
                transition: {
                  duration: 0.3,
                },
              },
            }}
            className="absolute left-1/2 -translate-x-1/2 bg-blue-500 rounded-full w-10 h-10"
          />

          {/* Contenedor principal */}
          <motion.div
            className="relative flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{
              duration: 0.3,
              ease: "backOut",
            }}
          >
            <motion.div
              className="flex items-center bg-white/90 backdrop-blur-md border border-gray-200 rounded-full shadow-lg dark:bg-slate-700 dark:border-gray-800 overflow-hidden"
              initial={{
                width: "40px",
                height: "40px",
              }}
              animate={{
                width: isExpanded ? "auto" : "40px",
                height: "40px",
                transition: {
                  duration: 0.5,
                  ease: "easeInOut",
                },
              }}
              exit={{
                width: "40px",
                height: "40px",
                transition: {
                  duration: 0.5,
                  ease: "easeInOut",
                },
              }}
            >
              {/* Ícono de notificación */}
              <motion.div
                className="flex-shrink-0 p-2"
                initial={{ scale: 0.5, rotate: -180 }}
                animate={{
                  scale: 1,
                  rotate: 0,
                  transition: {
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                  },
                }}
                exit={{
                  scale: 0.5,
                  rotate: -180,
                  transition: {
                    duration: 0.3,
                    ease: "easeInOut",
                  },
                }}
              >
                <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </motion.div>

              {/* Mensaje de bienvenida */}
              <motion.p
                className="px-4 text-sm font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: isExpanded ? 1 : 0,
                  transition: {
                    duration: 0.3,
                    delay: isExpanded ? 0.2 : 0,
                  },
                }}
                exit={{
                  opacity: 0,
                  transition: {
                    duration: 0.2,
                  },
                }}
              >
                {welcomeText}
              </motion.p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationBubble;