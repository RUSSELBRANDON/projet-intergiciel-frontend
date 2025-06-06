import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BookFormData {
  id?: string;
  title: string;
  author: string;
  publication_date?: string;
  genre?: string;
  available: boolean;
}

interface BookModalProps {
  isOpen: boolean;
  isEditing: boolean;
  initialData: BookFormData;
  onClose: () => void;
  onSubmit: (formData: BookFormData) => Promise<void>;
}

const BookModal: React.FC<BookModalProps> = ({
  isOpen,
  isEditing,
  initialData,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState<BookFormData>(initialData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData);
      setError(null);
    }
  }, [isOpen, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, available: e.target.checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      await onSubmit(formData);
      onClose();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erreur lors de la sauvegarde du livre.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black bg-opacity-50"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="relative bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {isEditing ? 'Modifier le livre' : 'Ajouter un livre'}
                </h2>

                {error && (
                  <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Titre *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="author" className="block text-sm font-medium text-gray-700">
                      Auteur *
                    </label>
                    <input
                      type="text"
                      id="author"
                      name="author"
                      value={formData.author}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="publication_date" className="block text-sm font-medium text-gray-700">
                      Date de publication
                    </label>
                    <input
                      type="text"
                      id="publication_date"
                      name="publication_date"
                      value={formData.publication_date || ''}
                      onChange={handleChange}
                      placeholder="JJ/MM/AAAA"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="genre" className="block text-sm font-medium text-gray-700">
                      Genre
                    </label>
                    <input
                      type="text"
                      id="genre"
                      name="genre"
                      value={formData.genre || ''}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      id="available"
                      name="available"
                      type="checkbox"
                      checked={formData.available}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="available" className="ml-2 block text-sm text-gray-900">
                      Disponible à l'emprunt
                    </label>
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      {isEditing ? 'Enregistrer' : 'Ajouter'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BookModal;