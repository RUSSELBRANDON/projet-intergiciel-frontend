import React from 'react';
import { motion } from 'framer-motion';
import { Book, BookOpen } from 'lucide-react';

interface SidebarProps {
  activeView: 'all' | 'my-books' | 'borrowed' | 'loaned' | 'requests';
  onViewChange: (view: 'all' | 'my-books' | 'borrowed' | 'loaned' | 'requests') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  return (
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-64 bg-white shadow-md h-full"
    >
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Bibliothèque</h2>
        <nav className="space-y-2">
          <button
            onClick={() => onViewChange('all')}
            className={`flex items-center w-full px-4 py-3 text-left rounded-md ${
              activeView === 'all'
                ? 'bg-blue-50 text-blue-800'
                : 'text-gray-700 hover:bg-gray-100'
            } transition-colors duration-200`}
          >
            <BookOpen className="h-5 w-5 mr-3" />
            <span className="font-medium">Tous les livres</span>
          </button>
          
          <button
            onClick={() => onViewChange('my-books')}
            className={`flex items-center w-full px-4 py-3 text-left rounded-md ${
              activeView === 'my-books'
                ? 'bg-blue-50 text-blue-800'
                : 'text-gray-700 hover:bg-gray-100'
            } transition-colors duration-200`}
          >
            <Book className="h-5 w-5 mr-3" />
            <span className="font-medium">Mes livres</span>
          </button>

          <button
            onClick={() => onViewChange('borrowed')}
            className={`flex items-center w-full px-4 py-3 text-left rounded-md ${
              activeView === 'borrowed'
                ? 'bg-blue-50 text-blue-800'
                : 'text-gray-700 hover:bg-gray-100'
            } transition-colors duration-200`}
          >
            <Book className="h-5 w-5 mr-3" />
            <span className="font-medium">Mes emprunts</span>
          </button>

          <button
            onClick={() => onViewChange('loaned')}
            className={`flex items-center w-full px-4 py-3 text-left rounded-md ${
              activeView === 'loaned'
                ? 'bg-blue-50 text-blue-800'
                : 'text-gray-700 hover:bg-gray-100'
            } transition-colors duration-200`}
          >
            <Book className="h-5 w-5 mr-3" />
            <span className="font-medium">Mes prêts</span>
          </button>

          <button
            onClick={() => onViewChange('requests')}
            className={`flex items-center w-full px-4 py-3 text-left rounded-md ${
              activeView === 'requests'
                ? 'bg-blue-50 text-blue-800'
                : 'text-gray-700 hover:bg-gray-100'
            } transition-colors duration-200`}
          >
            <Book className="h-5 w-5 mr-3" />
            <span className="font-medium">Demandes d'emprunt</span>
          </button>
        </nav>
      </div>
    </motion.div>
  );
};

export default Sidebar;