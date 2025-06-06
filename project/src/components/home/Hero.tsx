import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import bookLover from '../../assets/undraw_book-lover_cmz5 (1).svg';

const Hero: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center justify-between">
        
        {/* Texte à gauche */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="md:w-1/2 text-center md:text-left"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            Université de Dschang<br />
            <span className="text-blue-600">Plateforme Intelligente</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Simplifiez la gestion académique et documentaire de l’Université de Dschang avec une solution numérique intégrée, pensée pour les enseignants, étudiants et personnels.
          </p>

          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 justify-center md:justify-start">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to="/login/education" 
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-500 transition"
              >
                Gestion d'Enseignement
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to="/login/library" 
                className="px-6 py-3  bg-blue-700 text-slate-200 font-semibold rounded-lg shadow hover:bg-blue-700 transition"
              >
                Gestion de  Bibliothèque
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Illustration à droite */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="md:w-1/2 mt-12 md:mt-0"
        >
          <img 
            src={bookLover}
            alt="Illustration bibliothèque universitaire" 
            className="w-full h-auto"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
