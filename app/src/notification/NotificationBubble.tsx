import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";

interface NotificationBubbleProps {
  showWelcomeMessage: boolean;
  setShowWelcomeMessage: (show: boolean) => void;
  user: { name: string };
}

const NotificationBubble = ({ showWelcomeMessage, setShowWelcomeMessage, user }: NotificationBubbleProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const name = user?.name || "Usuario";
  const welcomeText = `¡Bienvenido ${name}!`;

  useEffect(() => {
    if (showWelcomeMessage && user) {
      setIsVisible(true);

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
  }, [showWelcomeMessage, setShowWelcomeMessage, user]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {/* Outer glow effect */}
          <motion.div
            variants={{
              initial: {
                scale: 0.8,
                opacity: 0,
                x: "-50%",
              },
              animate: {
                scale: [1, 1.2, 1],
                opacity: [0, 0.15, 0],
                x: "-50%",
                transition: {
                  duration: 1.5,
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
            className="absolute left-1/2 -translate-x-1/2 bg-blue-500/30 rounded-full w-12 h-12 blur-xl"
          />

          {/* Inner glow effect */}
          <motion.div
            variants={{
              initial: {
                scale: 0.9,
                opacity: 0,
                x: "-50%",
              },
              animate: {
                scale: [1, 1.1, 1],
                opacity: [0, 0.3, 0],
                x: "-50%",
                transition: {
                  duration: 1,
                  times: [0, 0.5, 1],
                  repeat: isExpanded ? 0 : Infinity,
                  repeatType: "reverse",
                },
              },
              exit: {
                scale: 0.9,
                opacity: 0,
                x: "-50%",
                transition: {
                  duration: 0.2,
                },
              },
            }}
            className="absolute left-1/2 -translate-x-1/2 bg-blue-400/40 rounded-full w-10 h-10 blur-md"
          />

          {/* Main container */}
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
              className="flex items-center bg-white/90 backdrop-blur-md border border-blue-100 rounded-full shadow-lg shadow-blue-500/20 dark:bg-slate-800/90 dark:border-blue-900/50 overflow-hidden"
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
              {/* Notification icon with glow */}
              <motion.div
                className="relative flex-shrink-0 p-2 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/20"
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
                <div className="absolute inset-0 bg-blue-400/10 blur" />
                <Bell className="relative w-5 h-5 text-blue-600 dark:text-blue-400" />
              </motion.div>

              {/* Welcome message */}
              <motion.p
                className="px-4 text-sm font-medium bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-blue-300 whitespace-nowrap"
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