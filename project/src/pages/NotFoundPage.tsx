import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
        <h2 className="text-3xl font-semibold mb-4">Page non trouvée</h2>
        <p className="text-gray-600 mb-6">La page que vous recherchez n'existe pas ou a été déplacée.</p>
        <Link 
          to="/" 
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
