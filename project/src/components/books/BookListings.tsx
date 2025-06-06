import React from 'react';

interface BorrowedBook {
  id: string;
  title: string;
  borrowerName: string;
  borrowDate: string;
  returnDate: string;
}

interface LoanedBook {
  id: string;
  title: string;
  borrowerName: string;
  borrowDate: string;
  returnDate: string;
}

interface LoanRequest {
  id: string;
  requesterName: string;
  bookTitle: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface BookListingsProps {
  borrowedBooks: BorrowedBook[];
  loanedBooks: LoanedBook[];
  loanRequests: LoanRequest[];
  onReturn: (bookId: string) => void;
  onRespond: (requestId: string, action: 'approve' | 'reject') => void;
}

const BookListings: React.FC<BookListingsProps> = ({
  borrowedBooks,
  loanedBooks,
  loanRequests,
  onReturn,
  onRespond
}) => {
  return (
    <div className="space-y-8">
      {/* Livres empruntés */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Livres empruntés</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prêté par</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date d'emprunt</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de retour</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {borrowedBooks.map((book) => (
              <tr key={book.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{book.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.borrowerName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.borrowDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.returnDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onReturn(book.id)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Remettre
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Livres prêtés */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Livres prêtés</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Emprunté par</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date d'emprunt</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de retour</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loanedBooks.map((book) => (
              <tr key={book.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{book.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.borrowerName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.borrowDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.returnDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Demandes d'emprunt */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Demandes d'emprunt</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre du livre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de demande</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loanRequests.map((request) => (
              <tr key={request.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.requesterName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.bookTitle}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.requestDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    request.status === 'approved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {request.status === 'pending' ? 'En attente' :
                     request.status === 'approved' ? 'Approuvé' :
                     'Rejeté'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {request.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onRespond(request.id, 'approve')}
                        className="text-green-600 hover:text-green-900"
                      >
                        Approuver
                      </button>
                      <button
                        onClick={() => onRespond(request.id, 'reject')}
                        className="text-red-600 hover:text-red-900"
                      >
                        Rejeter
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookListings;
