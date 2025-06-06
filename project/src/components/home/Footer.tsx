import React from 'react';
import { Link } from 'react-router-dom';
import { School, Facebook, Twitter, Instagram, Linkedin as LinkedIn, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-900  text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id='about'>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1  md:col-span-1">
            <Link to="/" className="flex items-center mb-5">
              <School className="h-8 w-8 text-white" />
              <span className="ml-2 text-xl font-bold">Université de Dschang</span>
            </Link>
            <p className="text-blue-200 mb-4">
              Une formation de qualité pour un avenir meilleur.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com/universite-dschang" 
                aria-label="Facebook" 
                className="text-white hover:text-blue-300"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a 
                href="https://twitter.com/universite-dschang" 
                aria-label="Twitter" 
                className="text-white hover:text-blue-300"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a 
                href="https://instagram.com/universite-dschang" 
                aria-label="Instagram" 
                className="text-white hover:text-blue-300"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a 
                href="https://linkedin.com/in/universite-dschang" 
                aria-label="LinkedIn" 
                className="text-white hover:text-blue-300"
              >
                <LinkedIn className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-blue-200 hover:text-white">Accueil</Link>
              </li>
              <li>
                <a href="#about" className="text-blue-200 hover:text-white">À propos</a>
              </li>
              <li>
                <Link to="/login/education" className="text-blue-200 hover:text-white">Enseignement</Link>
              </li>
              <li>
                <Link to="/login/library" className="text-blue-200 hover:text-white">Bibliothèque</Link>
              </li>
              <li>
                <a href="#contact" className="text-blue-200 hover:text-white">Contact</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Nos Services</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-blue-200 hover:text-white">Formation Initiale</a>
              </li>
              <li>
                <a href="#" className="text-blue-200 hover:text-white">Formation Continue</a>
              </li>
              <li>
                <a href="#" className="text-blue-200 hover:text-white">Recherche Académique</a>
              </li>
              <li>
                <a href="#" className="text-blue-200 hover:text-white">Partenariats Entreprises</a>
              </li>
              <li>
                <a href="#" className="text-blue-200 hover:text-white">Orientation Carrière</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-blue-300" />
                <a href="mailto:contact@univ-dschang.cm" className="text-blue-200 hover:text-white">
                  contact@univ-dschang.cm
                </a>
              </li>
              <li>
                <p className="text-blue-200">
                  Université de Dschang<br />
                  BP 96, Dschang, Cameroun
                </p>
              </li>
              <li>
                <p className="text-blue-200">
                  +237 222 22 22 22
                </p>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-blue-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-blue-200 text-sm">
              &copy; {new Date().getFullYear()} Université de Dschang. Tous droits réservés.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-sm text-blue-200 hover:text-white">Politique de confidentialité</a>
              <a href="#" className="text-sm text-blue-200 hover:text-white">Conditions d'utilisation</a>
              <a href="#" className="text-sm text-blue-200 hover:text-white">Mentions légales</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
