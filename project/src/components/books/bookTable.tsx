import React from 'react';

export interface Book {
  id?: string;
  title: string;
  author: string;
  publication_date?: string;
  genre?: string;
  available: boolean;
}

interface BookTableProps {
  books: Book[];
  currentUserId: string;
  currentView: 'all' | 'my-books';
  onEdit: (book: any) => void;
  onDelete: (id: string) => void;
  onBorrow: (id: string) => void;
  pendingRequests?: string[];
}

const BookTable: React.FC<BookTableProps> = ({
  books,
  currentUserId,
  currentView,
  onEdit,
  onDelete,
  onBorrow,
  pendingRequests = []
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Auteur</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Genre</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {books.map(book => (
            <tr key={book.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{book.title}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.author}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.genre || 'Non spécifié'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${book.available ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                  {book.available ? 'Disponible' : 'Emprunté'}
                </span>
              </td>
              <td className="px-6 py-3 whitespace-nowrap text-sm font-medium">
                {currentView === 'my-books' && (
                  <>
                    <button
                      onClick={() => onEdit(book)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => book.id && onDelete(book.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Supprimer
                    </button>
                  </>
                )}
                {currentView === 'all' && (
                  <>
                    {book.available && !pendingRequests.includes(book.id) ? (
                      <button
                        onClick={() => book.id && onBorrow(book.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Emprunter
                      </button>
                    ) : book.available ? (
                      <span className="text-blue-500">Demande envoyée</span>
                    ) : (
                      <span className="text-gray-500">Non disponible</span>
                    )}
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {books.length === 0 && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">Aucun livre trouvé.</p>
        </div>
      )}
    </div>
  );
};

export default BookTable;