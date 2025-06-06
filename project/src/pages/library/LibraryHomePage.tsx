import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/home/Footer';

const LibraryHomePage: React.FC = () => {
  const { currentUser } = useAuth();
  const { books, loans, fetchBooks, borrowBook } = useData();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<typeof books[0] | null>(null);
  const [returnDate, setReturnDate] = useState('');
  
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
  const handleBorrow = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedBook && currentUser) {
      try {
        await borrowBook(selectedBook.id, currentUser.id, returnDate);
        setShowBorrowModal(false);
        setSelectedBook(null);
        setReturnDate('');
        fetchBooks(); // Rafraîchir les livres après emprunt
      } catch (error) {
        console.error('Error borrowing book:', error);
      }
    }
  };
  
  // Calculer la date minimum (aujourd'hui) et maximum (30 jours à partir d'aujourd'hui)
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];
  
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 30);
  const maxDateStr = maxDate.toISOString().split('T')[0];
  
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
                <button
                  onClick={() => {
                    if (book.available) {
                      setSelectedBook(book);
                      setShowBorrowModal(true);
                    }
                  }}
                  disabled={!book.available}
                  className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                    book.available 
                      ? 'bg-blue-800 hover:bg-blue-900' 
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  {book.available ? 'Emprunter' : 'Indisponible'}
                </button>
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
      
      {/* Modal d'emprunt */}
      {showBorrowModal && selectedBook && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"></span>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Clock className="h-6 w-6 text-blue-800" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Emprunter "{selectedBook.title}"
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Veuillez indiquer la date de retour prévue pour ce livre. La durée maximale d'emprunt est de 30 jours.
                      </p>
                    </div>
                  </div>
                </div>
                
                <form onSubmit={handleBorrow} className="mt-5">
                  <div>
                    <label htmlFor="return-date" className="block text-sm font-medium text-gray-700">
                      Date de retour
                    </label>
                    <input
                      type="date"
                      id="return-date"
                      name="return-date"
                      min={minDate}
                      max={maxDateStr}
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-800 focus:border-blue-800 sm:text-sm"
                    />
                  </div>
                  
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-800 text-base font-medium text-white hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800 sm:col-start-2 sm:text-sm"
                    >
                      Confirmer l'emprunt
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowBorrowModal(false);
                        setSelectedBook(null);
                      }}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800 sm:mt-0 sm:col-start-1 sm:text-sm"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryHomePage;