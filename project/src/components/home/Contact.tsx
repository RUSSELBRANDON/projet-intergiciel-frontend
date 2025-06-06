import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulation d'envoi de formulaire
    alert('Votre message a été envoyé avec succès!');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Contactez-Nous
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Nous sommes à votre disposition pour répondre à toutes vos questions et vous fournir plus d'informations sur nos programmes.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Envoyez-nous un message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom complet
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-800 focus:border-blue-800"
                  placeholder="Votre nom"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse e-mail
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-800 focus:border-blue-800"
                  placeholder="votre.email@exemple.com"
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Sujet
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-800 focus:border-blue-800"
                  placeholder="Objet de votre message"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-800 focus:border-blue-800"
                  placeholder="Votre message..."
                ></textarea>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full px-6 py-4 bg-blue-800 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <Send className="h-5 w-5 mr-2" />
                Envoyer le message
              </motion.button>
            </form>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Informations de contact</h3>
            
            <div className="bg-gray-50 rounded-lg p-8 shadow-lg mb-8">
              <div className="flex items-start mb-6">
                <div className="flex-shrink-0 bg-blue-800 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">Adresse</h4>
                  <p className="text-gray-600 mt-1">
                    Université de Dschang<br />
                    Dschang, Cameroun
                  </p>
                </div>
              </div>
              
              <div className="flex items-start mb-6">
                <div className="flex-shrink-0 bg-blue-800 p-3 rounded-full">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">Email</h4>
                  <p className="text-gray-600 mt-1">
                    contact@univ-dschang.cm<br />
                    admissions@univ-dschang.cm
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-blue-800 p-3 rounded-full">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">Téléphone</h4>
                  <p className="text-gray-600 mt-1">
                    +237 233 42 17 00<br />
                    +237 233 42 17 01
                  </p>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg overflow-hidden h-80 shadow-lg">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15920.99314537033!2d10.08807723032127!3d5.807375123933763!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1070a3f1eb2be69d%3A0x98b397ba6debb292!2sUniversity%20of%20Dschang!5e0!3m2!1sen!2sca!4v1672304118480!5m2!1sen!2sca" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Carte localisation"
              ></iframe>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
