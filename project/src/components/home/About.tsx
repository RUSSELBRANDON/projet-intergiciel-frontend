import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const About: React.FC = () => {
  const features = [
    {
      title: "Gestion des Enseignements",
      description: "Système complet pour gérer les cours, les enseignants, les étudiants et les résultats."
    },
    {
      title: "Suivi des Performances",
      description: "Tableaux de bord analytiques pour suivre les performances des étudiants et l'efficacité des enseignements."
    },
    {
      title: "Bibliothèque Numérique",
      description: "Catalogue complet des ressources avec un système d'emprunt et de réservation intégré."
    },
    {
      title: "Accessibilité 24/7",
      description: "Accès à la plateforme à tout moment et de n'importe où pour une flexibilité maximale."
    }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            À Propos de l'Université de Dschang
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            L'Université de Dschang se consacre à offrir une éducation de qualité et des ressources pédagogiques complètes pour favoriser la réussite de ses étudiants.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <img 
              src="https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
              alt="Campus de l'Université de Dschang" 
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
            <div className="absolute inset-0 bg-blue-900 opacity-20 rounded-lg"></div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Notre Mission</h3>
            <p className="text-gray-600 mb-6">
              Fondée en 1971, l'Université de Dschang a pour mission de fournir une éducation de haute qualité et de préparer les étudiants à devenir des professionnels compétents et des leaders dans leurs domaines.
            </p>
            <p className="text-gray-600 mb-8">
              Nous combinons l'excellence académique avec une approche pratique, soutenue par des ressources pédagogiques diversifiées et accessibles.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="flex items-start"
                >
                  <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mr-2" />
                  <div>
                    <h4 className="font-medium text-gray-900">{feature.title}</h4>
                    <p className="text-sm text-gray-500">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="overflow-hidden rounded-lg shadow-lg"
          >
            <img 
              src="https://images.pexels.com/photos/1516440/pexels-photo-1516440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
              alt="Bibliothèque de l'Université de Dschang" 
              className="w-full h-60 object-cover"
            />
            <div className="p-6 bg-white">
              <h3 className="font-bold text-xl mb-2 text-gray-900">Bibliothèque Moderne</h3>
              <p className="text-gray-600">
                La bibliothèque de l'Université de Dschang offre une riche collection de ressources académiques et littéraires pour soutenir l'apprentissage de ses étudiants.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="overflow-hidden rounded-lg shadow-lg"
          >
            <img 
              src="https://images.pexels.com/photos/267507/pexels-photo-267507.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
              alt="Salle de classe à l'Université de Dschang" 
              className="w-full h-60 object-cover"
            />
            <div className="p-6 bg-white">
              <h3 className="font-bold text-xl mb-2 text-gray-900">Salles Équipées</h3>
              <p className="text-gray-600">
                Des salles de classe modernes et bien équipées pour offrir un enseignement interactif et de qualité.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="overflow-hidden rounded-lg shadow-lg"
          >
            <img 
              src="https://images.pexels.com/photos/935949/pexels-photo-935949.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
              alt="Laboratoire à l'Université de Dschang" 
              className="w-full h-60 object-cover"
            />
            <div className="p-6 bg-white">
              <h3 className="font-bold text-xl mb-2 text-gray-900">Laboratoires Spécialisés</h3>
              <p className="text-gray-600">
                L'université dispose de laboratoires spécialisés qui permettent aux étudiants de pratiquer et d'acquérir des compétences pratiques dans leur domaine d'étude.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
