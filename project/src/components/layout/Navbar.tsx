import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, User, BookOpen, School, Home } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavbarProps {
  transparent?: boolean;
  withSearch?: boolean;
  type?: 'main' | 'education' | 'library';
}

const Navbar: React.FC<NavbarProps> = ({ transparent = false, withSearch = false, type = 'main' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleScrollTo = (hash: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        scrollToHash(hash);
      }, 100);
    } else {
      scrollToHash(hash);
    }
    setIsOpen(false);
  };

  const scrollToHash = (hash: string) => {
    const element = document.getElementById(hash.replace('#', ''));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getNavLinks = () => {
    if (type === 'main') {
      return [
        { name: 'Accueil', path: '/', icon: <Home className="h-5 w-5" />, isAnchor: false },
        { name: 'À propos', path: '#about', icon: <BookOpen className="h-5 w-5" />, isAnchor: true },
        { name: 'Contact', path: '#contact', icon: <User className="h-5 w-5" />, isAnchor: true },
      ];
    } else if (type === 'education') {
      return [
        { name: 'Accueil', path: '/education/dashboard', icon: <Home className="h-5 w-5" />, isAnchor: false },
        { name: 'Cours', path: '/education/courses', icon: <School className="h-5 w-5" />, isAnchor: false },
        { name: 'Profil', path: '/education/profile', icon: <User className="h-5 w-5" />, isAnchor: false },
      ];
    } else {
      return [
        { name: 'Accueil', path: '/library/home', icon: <Home className="h-5 w-5" />, isAnchor: false },
        { name: 'Livres', path: '/library/admin', icon: <BookOpen className="h-5 w-5" />, isAnchor: false },
        { name: 'À propos', path: '#about', icon: <BookOpen className="h-5 w-5" />, isAnchor: false },
        { name: 'Profil', path: '/library/profile', icon: <User className="h-5 w-5" />, isAnchor: false },
      ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`${transparent ? 'bg-slate-200' : 'bg-white shadow-md'} w-full z-50 fixed top-0 left-0 right-0`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <School className="h-8 w-8 text-blue-800" />
              <span className="ml-2 text-xl font-bold text-blue-800">UDS</span>
            </Link>
          </div>

          {withSearch && (
            <div className="hidden md:flex items-center justify-center flex-1 px-8">
              <div className="relative w-full max-w-lg">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full py-2 pl-10 pr-4 text-gray-700 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
              </div>
            </div>
          )}

          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              link.isAnchor ? (
                <button
                  key={link.name}
                  onClick={() => handleScrollTo(link.path)}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    window.location.hash === link.path
                      ? 'text-blue-800 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-800 hover:bg-blue-50'
                  }`}
                >
                  {link.icon}
                  <span className="ml-1">{link.name}</span>
                </button>
              ) : (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    location.pathname === link.path
                      ? 'text-blue-800 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-800 hover:bg-blue-50'
                  }`}
                >
                  {link.icon}
                  <span className="ml-1">{link.name}</span>
                </Link>
              )
            ))}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-700 hover:text-blue-800 hover:bg-blue-50 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-white shadow-lg"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {withSearch && (
              <div className="px-4 pb-3 pt-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    className="w-full py-2 pl-10 pr-4 text-gray-700 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                </div>
              </div>
            )}

            {navLinks.map((link) => (
              link.isAnchor ? (
                <button
                  key={link.name}
                  onClick={() => handleScrollTo(link.path)}
                  className={`flex items-center px-3 py-2 text-base font-medium rounded-md ${
                    window.location.hash === link.path
                      ? 'text-blue-800 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-800 hover:bg-blue-50'
                  }`}
                >
                  {link.icon}
                  <span className="ml-2">{link.name}</span>
                </button>
              ) : (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center px-3 py-2 text-base font-medium rounded-md ${
                    location.pathname === link.path
                      ? 'text-blue-800 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-800 hover:bg-blue-50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.icon}
                  <span className="ml-2">{link.name}</span>
                </Link>
              )
            ))}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;