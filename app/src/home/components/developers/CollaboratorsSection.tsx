import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';

interface Collaborator {
  login: string;
  username?: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

const CollaboratorsSection: React.FC = () => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = import.meta.env.VITE_GITHUB_TOKEN;
    if (!token) {
      console.error('GitHub token is not defined');
      return;
    }

    fetch('https://api.github.com/repos/4lexxe/DevsProject/contributors', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setCollaborators(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching contributors:', error);
        setLoading(false);
      });
  }, []);

  return (
    <section className="py-8 sm:py-16 bg-gradient-to-b from-gray-50 to-white" id="collaborators">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Nuestros Colaboradores</h2>
          <p className="mt-4 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Conoce al equipo de desarrolladores que hacen posible este proyecto
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <motion.div className="flex flex-wrap justify-center gap-6 items-center">
            {collaborators.length > 0 ? (
              collaborators.map((collaborator) => (
                <motion.div
                  key={collaborator.login}
                  whileHover={{ scale: 1.1 }}
                  className="group relative w-[140px] sm:w-[180px] text-center"
                >
                  <div className="relative">
                    <img
                      src={collaborator.avatar_url}
                      alt={collaborator.username || collaborator.login}
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-full ring-4 ring-blue-100 group-hover:ring-blue-300 transition-all duration-300 object-cover mx-auto"
                    />
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -bottom-2 right-2 sm:right-4 bg-blue-600 text-white text-sm font-bold rounded-full px-3 py-1 shadow-lg"
                    >
                      {collaborator.contributions}
                    </motion.div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mt-3 truncate px-2">
                    {collaborator.username || collaborator.login}
                  </h3>
                  <div className="flex justify-center space-x-3 mt-2">
                    <motion.a
                      whileHover={{ scale: 1.2 }}
                      href={collaborator.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                    >
                      <Github className="h-6 w-6" />
                    </motion.a>
                    <motion.a
                      whileHover={{ scale: 1.2 }}
                      href={`${collaborator.html_url}?tab=repositories`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                    >
                      <ExternalLink className="h-6 w-6" />
                    </motion.a>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                <p className="text-xl text-gray-600">No se encontraron colaboradores.</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default CollaboratorsSection;
