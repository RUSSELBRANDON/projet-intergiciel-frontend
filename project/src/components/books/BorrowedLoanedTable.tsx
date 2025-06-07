// components/books/BorrowedLoanedTable.tsx
import React from 'react';

interface LoanEntry {
  id: string; // ID du prêt
  bookTitle: string;
  borrowerName?: string; // Pour les livres prêtés
  lenderName?: string; // Pour les livres empruntés
  loanDate: string;
  returnDate: string;
}

interface BorrowedLoanedTableProps {
  books: LoanEntry[]; // Renommé de 'loans' pour être plus clair
  type: 'borrowed' | 'loaned';
  onReturn: (loanId: string) => void;
}

const BorrowedLoanedTable: React.FC<BorrowedLoanedTableProps> = ({ books, type, onReturn }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Livre</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {type === 'borrowed' ? 'Prêté par' : 'Emprunté par'}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date d'emprunt</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de retour prévue</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {books.map((book) => (
            <tr key={book.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{book.bookTitle}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {type === 'borrowed' ? book.lenderName : book.borrowerName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(book.loanDate).toLocaleDateString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(book.returnDate).toLocaleDateString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {type === 'borrowed' && (
                  <button
                    onClick={() => onReturn(book.id)}
                    className="text-blue-600 hover:text-blue-900"
                    title="Retourner ce livre"
                  >
                    Retourner
                  </button>
                )}
                {type === 'loaned' && ( // Optionnel: pour marquer comme retourné par le prêteur
                    <button
                        onClick={() => onReturn(book.id)} // Le même handler peut être utilisé
                        className="text-green-600 hover:text-green-900"
                        title="Marquer comme retourné"
                    >
                        Marquer comme retourné
                    </button>
                )}
              </td>
            </tr>
          ))}
          {books.length === 0 && (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                {type === 'borrowed' ? 'Vous n\'avez actuellement aucun livre emprunté.' : 'Vous n\'avez actuellement aucun livre prêté.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BorrowedLoanedTable;