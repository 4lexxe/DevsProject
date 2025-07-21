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
        const filteredCollaborators = data.filter(
          (collaborator: Collaborator) => collaborator.contributions > 1
        );
        setCollaborators(filteredCollaborators);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching contributors:', error);
        setLoading(false);
      });
  }, []);

  return (
    <section className="py-6 sm:py-12 bg-gradient-to-b from-gray-50 to-white" id="collaborators">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 sm:mb-8"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Nuestros Contruibuidores</h2>
          <p className="mt-3 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Conoce al equipo de desarrolladores que hacen posible este proyecto
          </p>
        </motion.div>
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <motion.div className="flex flex-wrap justify-center gap-4 items-center">
            {collaborators.length > 0 ? (
              collaborators.map((collaborator) => (
                <motion.div
                  key={collaborator.login}
                  whileHover={{ scale: 1.1 }}
                  className="group relative w-[100px] sm:w-[140px] text-center"
                >
                  <div className="relative">
                    <img
                      src={collaborator.avatar_url}
                      alt={collaborator.username || collaborator.login}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full ring-2 ring-blue-100 group-hover:ring-blue-300 transition-all duration-300 object-cover mx-auto"
                    />
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 mt-2 truncate px-1">
                    {collaborator.username || collaborator.login}
                  </h3>
                  <div className="flex justify-center space-x-2 mt-2">
                    <motion.a
                      whileHover={{ scale: 1.2 }}
                      href={collaborator.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                    >
                      <Github className="h-4 w-4" />
                    </motion.a>
                    <motion.a
                      whileHover={{ scale: 1.2 }}
                      href={`${collaborator.html_url}?tab=repositories`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </motion.a>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
                <p className="text-base text-gray-600">No se encontraron contribuidores.</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default CollaboratorsSection;