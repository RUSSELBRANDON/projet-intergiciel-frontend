import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/home/Footer';

const LibraryHomePage: React.FC = () => {
  const { currentUser } = useAuth();
  const { books, fetchBooks, borrowBook } = useData();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [pendingRequests, setPendingRequests] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Charger les livres au montage
  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // Filtrer les livres en fonction de la recherche
  const filteredBooks = books.filter(book => {
    if (!searchTerm) return true;
    
    const term = searchTerm.toLowerCase();
    return (
      book.title.toLowerCase().includes(term) ||
      book.author.toLowerCase().includes(term) ||
      (book.genre && book.genre.toLowerCase().includes(term))
    );
  });
  
  // Fonction pour emprunter un livre
  const handleBorrow = async (bookId: string) => {
    try {
      setError(null);
      if (!currentUser || !currentUser.id) {
        throw new Error('Utilisateur non connecté ou ID manquant');
      }
      console.log('Calling borrowBook with:', { bookId, userId: currentUser.id });
      await borrowBook(bookId, currentUser.id);
      setPendingRequests(prev => [...prev, bookId]);
      fetchBooks();
    } catch (error: any) {
      console.error('Error borrowing book:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la demande d\'emprunt. Veuillez réessayer.';
      setError(errorMessage);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar type="library" withSearch={true} />
      
      {/* Hero section */}
      <div className="relative bg-blue-800 text-white">
        <div className="absolute inset-0">
          <img 
            className="w-full h-full object-cover opacity-20"
            src="https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="Bibliothèque"
          />
          <div className="absolute inset-0 bg-blue-900 mix-blend-multiply" aria-hidden="true"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Bienvenue dans notre bibliothèque
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-xl max-w-3xl"
          >
            Explorez notre collection de livres et empruntez vos favoris en quelques clics. 
            Notre bibliothèque numérique vous offre un accès facile à la connaissance et au divertissement.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 max-w-lg"
          >
            <div className="relative rounded-md shadow-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-transparent rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-white sm:text-md"
                placeholder="Rechercher par titre, auteur ou genre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Catalogue de livres */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900">Notre catalogue</h2>
          <p className="mt-4 text-lg text-gray-600">
            Découvrez notre sélection de livres disponibles à l'emprunt
          </p>
        </div>
        
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded"
          >
            {error}
          </motion.div>
        )}
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredBooks.map((book) => (
            <motion.div 
              key={book.id}
              whileHover={{ y: -5 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col"
            >
              <div className="h-48 w-full relative">
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${book.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {book.available ? 'Disponible' : 'Emprunté'}
                  </span>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{book.title}</h3>
                <p className="text-sm text-gray-600 mb-4">par {book.author}</p>
                <p className="text-gray-600 mb-6 flex-1 line-clamp-3">{book.genre || 'Genre non spécifié'}</p>
                {book.available && !pendingRequests.includes(book.id) ? (
                  <button
                    onClick={() => book.id && handleBorrow(book.id)}
                    disabled={!book.available}
                    className="w-full py-2 px-4 rounded-md text-white font-medium bg-blue-800 hover:bg-blue-900"
                  >
                    Emprunter
                  </button>
                ) : book.available ? (
                  <span className="w-full py-2 px-4 rounded-md text-blue-500 font-medium text-center">
                    Demande envoyée
                  </span>
                ) : (
                  <span className="w-full py-2 px-4 rounded-md text-gray-500 font-medium text-center">
                    Indisponible
                  </span>
                )}
              </div>
            </motion.div>
          ))}
          
          {filteredBooks.length === 0 && (
            <div className="col-span-full text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Aucun livre trouvé</h3>
              <p className="mt-1 text-sm text-gray-500">
                Essayez de modifier vos critères de recherche.
              </p>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default LibraryHomePage;