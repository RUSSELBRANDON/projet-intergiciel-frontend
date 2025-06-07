import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import BookTable from '../../components/books/BookTable';
import BookModal from '../../components/books/BookModal';

interface BookFormData {
  id?: string;
  title: string;
  author: string;
  publication_date?: string;
  genre?: string;
  available: boolean;
}

const LibraryDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { books, fetchBooks, fetchUserBooks, addBook, updateBook, deleteBook, borrowBook } = useData();
  
  const [activeView, setActiveView] = useState<'all' | 'my-books'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [userBooks, setUserBooks] = useState<BookFormData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pendingRequests, setPendingRequests] = useState<string[]>([]);
  
  const [bookForm, setBookForm] = useState<BookFormData>({
    title: '',
    author: '',
    publication_date: '',
    genre: '',
    available: true,
  });

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  useEffect(() => {
    if (activeView === 'my-books' && currentUser) {
      console.log('Current user ID:', currentUser.id);
      fetchUserBooks(currentUser.id).then(books => {
        setUserBooks(books);
        console.log('User books:', books);
      });
    }
  }, [activeView, currentUser, fetchUserBooks]);

  const getDisplayedBooks = useCallback(() => {
    if (!currentUser) return [];
    
    let booksToDisplay = activeView === 'my-books' ? userBooks : books;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      booksToDisplay = booksToDisplay.filter(book => 
        book.title.toLowerCase().includes(term) ||
        book.author.toLowerCase().includes(term) ||
        (book.genre && book.genre.toLowerCase().includes(term))
      );
    }
    
    return booksToDisplay;
  }, [activeView, currentUser, searchTerm, books, userBooks]);

  const displayedBooks = useMemo(() => getDisplayedBooks(), [getDisplayedBooks]);

  const resetForm = useCallback(() => {
    setBookForm({
      title: '',
      author: '',
      publication_date: '',
      genre: '',
      available: true,
    });
    setEditingBookId(null);
    setError(null);
  }, []);

  const handleEditBook = useCallback((book: BookFormData) => {
    if (!book.id) return;
    
    setBookForm({
      title: book.title,
      author: book.author,
      publication_date: book.publication_date || '',
      genre: book.genre || '',
      available: book.available,
    });
    setEditingBookId(book.id);
    setShowModal(true);
  }, []);

  const handleBookSubmit = useCallback(async (formData: BookFormData) => {
    try {
      setError(null);
      if (!currentUser) {
        throw new Error('Utilisateur non connecté');
      }

      if (editingBookId) {
        await updateBook(editingBookId, formData);
      } else {
        await addBook(formData, currentUser.id);
      }
      resetForm();
      setShowModal(false);
      fetchBooks();
      if (activeView === 'my-books') {
        fetchUserBooks(currentUser.id).then(setUserBooks);
      }
    } catch (error: any) {
      console.error('Error submitting book:', error);
      setError(error.response?.data?.message || 'Une erreur est survenue lors de la sauvegarde du livre.');
    }
  }, [addBook, editingBookId, fetchBooks, fetchUserBooks, resetForm, updateBook, activeView, currentUser]);

  const handleDeleteBook = useCallback(async (id: string) => {
    try {
      setError(null);
      if (window.confirm('Voulez-vous vraiment supprimer ce livre ?')) {
        await deleteBook(id);
        fetchBooks();
        if (activeView === 'my-books' && currentUser) {
          fetchUserBooks(currentUser.id).then(setUserBooks);
        }
      }
    } catch (error: any) {
      console.error('Error deleting book:', error);
      setError(error.response?.data?.message || 'Une erreur est survenue lors de la suppression du livre.');
    }
  }, [deleteBook, fetchBooks, fetchUserBooks, activeView, currentUser]);

  const handleBorrowBook = useCallback(async (bookId: string) => {
    try {
      setError(null);
      if (!currentUser) {
        throw new Error('Utilisateur non connecté');
      }
      await borrowBook(bookId, currentUser.id);
      setPendingRequests(prev => [...prev, bookId]);
      fetchBooks();
    } catch (error: any) {
      console.error('Error borrowing book:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la demande d\'emprunt. Veuillez réessayer.';
      setError(errorMessage);
    }
  }, [borrowBook, currentUser, fetchBooks]);

  useEffect(() => {
    setSearchTerm('');
  }, [activeView]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar type="library" withSearch={false} />
      
      <div className="flex flex-1 overflow-hidden pt-16">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
        
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <div className="sm:flex sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                  {activeView === 'my-books' ? 'Mes Livres' : 'Catalogue de Livres'}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {activeView === 'my-books' 
                    ? 'Gérez votre collection personnelle de livres' 
                    : 'Parcourez tous les livres de la bibliothèque'}
                </p>
              </div>
              
              {activeView === 'my-books' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    resetForm();
                    setShowModal(true);
                  }}
                  className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800"
                >
                  <Plus className="-ml-1 mr-2 h-5 w-5" />
                  Ajouter un livre
                </motion.button>
              )}
            </div>
          </motion.div>
          
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded"
            >
              {error}
            </motion.div>
          )}
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white shadow overflow-hidden sm:rounded-lg"
          >
            <div className="px-4 py-5 sm:p-6">
              <div className="max-w-lg w-full lg:max-w-xs mb-6">
                <label htmlFor="search" className="sr-only">Rechercher</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="search"
                    name="search"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-800 focus:border-blue-800"
                    placeholder="Rechercher un livre..."
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              {displayedBooks.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">Aucun livre trouvé. Essayez d'ajouter un livre.</p>
                </div>
              ) : (
                <BookTable 
                  books={displayedBooks}
                  currentUserId={currentUser?.id || ''}
                  currentView={activeView}
                  onEdit={handleEditBook}
                  onDelete={handleDeleteBook}
                  onBorrow={handleBorrowBook}
                  pendingRequests={pendingRequests}
                />
              )}
            </div>
          </motion.div>
        </main>
      </div>
      
      <BookModal 
        isOpen={showModal}
        isEditing={!!editingBookId}
        initialData={bookForm}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        onSubmit={handleBookSubmit}
      />
    </div>
  );
};

export default LibraryDashboard;