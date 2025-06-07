// components/books/BookTable.tsx
import React from 'react';
import { Pencil, Trash2, BookOpen } from 'lucide-react';

interface Book {
  id: string;
  title: string;
  author: string;
  publication_date?: string;
  genre?: string;
  available: boolean;
  owner_id: string; // ID du propriétaire du livre
}

interface BookTableProps {
  books: Book[];
  currentUserId: string;
  currentView: 'all-books' | 'my-books'; // Indique la vue active pour adapter les actions
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
  onBorrow: (book: Book) => void;
}

const BookTable: React.FC<BookTableProps> = ({
  books,
  currentUserId,
  currentView,
  onEdit,
  onDelete,
  onBorrow,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Auteur</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Publication</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Genre</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {books.map((book) => (
            <tr key={book.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{book.title}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.author}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.publication_date || 'N/A'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.genre || 'N/A'}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  book.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {book.available ? 'Disponible' : 'Indisponible'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {currentView === 'my-books' ? (
                  // Actions pour les livres que l'utilisateur possède
                  <>
                    <button
                      onClick={() => onEdit(book)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                      title="Modifier ce livre"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onDelete(book.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Supprimer ce livre"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  // Actions pour les livres du catalogue général
                  <button
                    onClick={() => onBorrow(book)}
                    disabled={!book.available || book.owner_id === currentUserId} // Ne peut pas emprunter son propre livre
                    className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm ${
                      book.available && book.owner_id !== currentUserId
                        ? 'text-white bg-blue-600 hover:bg-blue-700'
                        : 'text-gray-300 bg-gray-200 cursor-not-allowed'
                    }`}
                    title={book.owner_id === currentUserId ? "C'est votre livre" : (book.available ? "Emprunter ce livre" : "Livre non disponible")}
                  >
                    <BookOpen className="h-4 w-4 mr-1" /> Emprunter
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookTable;