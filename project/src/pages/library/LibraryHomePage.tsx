import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BookOpen, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import BookListings from '../../components/books/BookListings';
import { Book } from '../../components/books/bookTable';

const LibraryHomePage: React.FC = () => {
  const { currentUser } = useAuth();
  const { 
    books, 
    loans, 
    fetchBooks, 
    borrowBook,
    returnBook,
    handleLoanRequest,
    handleLoanResponse
  } = useData();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeView, setActiveView] = useState<'all' | 'my-books' | 'borrowed' | 'loaned' | 'requests'>('all');
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<typeof books[0] | null>(null);
  const [returnDate, setReturnDate] = useState('');
  const [borrowedBooks, setBorrowedBooks] = useState<any[]>([]);
  const [loanedBooks, setLoanedBooks] = useState<any[]>([]);
  const [loanRequests, setLoanRequests] = useState<any[]>([]);
  
  // Charger les livres au montage
  useEffect(() => {
    fetchBooks();
    
    // Mettre à jour les listes d'emprunts et de prêts
    const updateLists = () => {
      const borrowed = loans.filter(loan => loan.userId === currentUser?.id);
      const loaned = loans.filter(loan => loan.userId === currentUser?.id);
      const requests = loans.filter(loan => loan.status === 'pending');
      
      setBorrowedBooks(borrowed.map(loan => ({
        id: loan.bookId,
        title: loan.bookTitle,
        borrowerName: loan.lenderName,
        borrowDate: loan.loanDate,
        returnDate: loan.returnDate
      })));
      
      setLoanedBooks(loaned.map(loan => ({
        id: loan.bookId,
        title: loan.bookTitle,
        borrowerName: loan.borrowerName,
        borrowDate: loan.loanDate,
        returnDate: loan.returnDate
      })));
      
      setLoanRequests(requests.map(request => ({
        id: request.id,
        requesterName: request.borrowerName,
        bookTitle: request.bookTitle,
        requestDate: request.requestDate,
        status: request.status
      })));
    };
    
    updateLists();
  }, [fetchBooks, currentUser?.id]);

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

  // Gérer le retour d'un livre
  const handleReturn = async (bookId: string) => {
    try {
      await returnBook(bookId);
      fetchBooks();
    } catch (error) {
      console.error('Error returning book:', error);
    }
  };

  // Gérer la réponse à une demande d'emprunt
  const handleRequestResponse = async (requestId: string, action: 'approve' | 'reject') => {
    try {
      await handleLoanResponse(requestId, action);
      fetchBooks();
    } catch (error) {
      console.error('Error handling request:', error);
    }
  };
  
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
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <Sidebar 
        activeView={activeView}
        onViewChange={setActiveView}
      />

      {/* Main content */}
      <div className="flex-1 min-w-0">
      
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
            className="mt-4 text-lg text-gray-300"
          >
            Découvrez notre collection de livres et partagez avec la communauté.
          </motion.p>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-8">
            {filteredBooks.map((book) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900">{book.title}</h3>
                  <p className="mt-2 text-gray-500">{book.author}</p>
                  {book.genre && <p className="mt-1 text-sm text-gray-500">Genre: {book.genre}</p>}
                  <div className="mt-4">
                    <button
                      onClick={() => {
                        setSelectedBook(book);
                        setShowBorrowModal(true);
                      }}
                      disabled={!book.available}
                      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${
                        book.available ? 'text-white bg-blue-600 hover:bg-blue-700' : 'text-gray-300 bg-gray-200'
                      }`}
                    >
                      {book.available ? 'Emprunter' : 'Non disponible'}
                      <BookOpen className="ml-2 h-5 w-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {activeView === 'borrowed' && (
            <BookListings
              borrowedBooks={borrowedBooks}
              loanedBooks={[]}
              loanRequests={[]}
              onReturn={handleReturn}
              onRespond={() => {}}
            />
          )}

          {activeView === 'loaned' && (
            <BookListings
              borrowedBooks={[]}
              loanedBooks={loanedBooks}
              loanRequests={[]}
              onReturn={() => {}}
              onRespond={() => {}}
            />
          )}

          {activeView === 'requests' && (
            <BookListings
              borrowedBooks={[]}
              loanedBooks={[]}
              loanRequests={loanRequests}
              onReturn={() => {}}
              onRespond={handleRequestResponse}
            />
          )}
        </div>

        {/* Book listings */}
        {activeView === 'borrowed' && (
          <BookListings
            borrowedBooks={borrowedBooks}
            loanedBooks={[]}
            loanRequests={[]}
            onReturn={handleReturn}
            onRespond={() => {}}
          />
        )}

        {activeView === 'loaned' && (
          <BookListings
            borrowedBooks={[]}
            loanedBooks={loanedBooks}
            loanRequests={[]}
            onReturn={() => {}}
            onRespond={() => {}}
          />
        )}

        {activeView === 'requests' && (
          <BookListings
            borrowedBooks={[]}
            loanedBooks={[]}
            loanRequests={loanRequests}
            onReturn={() => {}}
            onRespond={handleRequestResponse}
          />
        )}
      </div>

      {/* Borrow modal */}
      <AnimatePresence>
        {showBorrowModal && selectedBook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 overflow-y-auto"
            >
              <div className="flex items-center justify-center min-h-full p-4 text-center sm:p-0">
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                        <Clock className="h-6 w-6 text-blue-800" />
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          Emprunter "{selectedBook?.title}"
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
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </div>
);
};

export default LibraryHomePage;