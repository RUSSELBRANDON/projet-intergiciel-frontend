import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

const VideoSection: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Découvrez Notre Institut
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Une visite virtuelle de nos installations et un aperçu de notre approche pédagogique.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl"
        >
          {!isPlaying ? (
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="Aperçu de la vidéo" 
                className="w-full h-auto"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsPlaying(true)}
                  className="w-20 h-20 bg-blue-800 rounded-full flex items-center justify-center shadow-lg"
                >
                  <Play className="h-10 w-10 text-white ml-1" />
                </motion.button>
              </div>
              <div className="absolute inset-0 bg-black opacity-30 pointer-events-none"></div>
            </div>
          ) : (
            <div className="relative pb-[56.25%] h-0">
              <iframe 
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
                title="Présentation de l'institut"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </motion.div>

        <div className="mt-12 text-center">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-gray-600 italic"
          >
            "Notre institut s'engage à offrir un environnement d'apprentissage stimulant et enrichissant pour tous nos étudiants."
          </motion.p>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="font-medium text-gray-900 mt-2"
          >
            — Dr. Martin Dupont, Directeur de l'Institut
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;