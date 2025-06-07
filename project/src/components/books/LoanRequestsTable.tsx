// components/books/LoanRequestsTable.tsx
import React from 'react';

interface LoanRequest {
  id: string;
  requesterName: string; // Nom de l'emprunteur
  bookTitle: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface LoanRequestsTableProps {
  requests: LoanRequest[];
  onRespond: (requestId: string, action: 'approved' | 'rejected') => void;
}

const LoanRequestsTable: React.FC<LoanRequestsTableProps> = ({ requests, onRespond }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Livre</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Demandeur</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de Demande</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {requests.map((request) => (
            <tr key={request.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.bookTitle}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.requesterName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(request.requestDate).toLocaleDateString()}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  request.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {request.status === 'pending' ? 'En attente' :
                  request.status === 'approved' ? 'Approuvé' : 'Rejeté'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {request.status === 'pending' && (
                  <>
                    <button
                      onClick={() => onRespond(request.id, 'approved')}
                      className="text-green-600 hover:text-green-900 mr-4"
                      title="Approuver la demande"
                    >
                      Approuver
                    </button>
                    <button
                      onClick={() => onRespond(request.id, 'rejected')}
                      className="text-red-600 hover:text-red-900"
                      title="Rejeter la demande"
                    >
                      Rejeter
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
          {requests.length === 0 && (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">Aucune demande d'emprunt en attente.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LoanRequestsTable;