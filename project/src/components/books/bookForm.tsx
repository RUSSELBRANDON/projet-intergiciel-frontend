// components/books/BookForm.tsx
import React from 'react';

interface BookFormData {
  id?: string;
  title: string;
  author: string;
  publication_date?: string;
  genre?: string;
  available: boolean;
  owner_id?: string;
}

interface BookFormProps {
  bookForm: BookFormData;
  handleBookChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleBookSubmit: (formData: BookFormData) => Promise<void>;
  onCancel: () => void;
  isEditMode: boolean;
}

const BookForm: React.FC<BookFormProps> = ({
  bookForm,
  handleBookChange,
  handleBookSubmit,
  onCancel,
  isEditMode,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleBookSubmit(bookForm);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Titre</label>
        <input
          type="text"
          id="title"
          name="title"
          value={bookForm.title}
          onChange={handleBookChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
          required
        />
      </div>
      <div>
        <label htmlFor="author" className="block text-sm font-medium text-gray-700">Auteur</label>
        <input
          type="text"
          id="author"
          name="author"
          value={bookForm.author}
          onChange={handleBookChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
          required
        />
      </div>
      <div>
        <label htmlFor="publication_date" className="block text-sm font-medium text-gray-700">Date de Publication</label>
        <input
          type="date"
          id="publication_date"
          name="publication_date"
          value={bookForm.publication_date}
          onChange={handleBookChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
        />
      </div>
      <div>
        <label htmlFor="genre" className="block text-sm font-medium text-gray-700">Genre</label>
        <input
          type="text"
          id="genre"
          name="genre"
          value={bookForm.genre}
          onChange={handleBookChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
        />
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id="available"
          name="available"
          checked={bookForm.available}
          onChange={handleBookChange}
          className="h-4 w-4 text-blue-800 focus:ring-blue-800 border-gray-300 rounded"
        />
        <label htmlFor="available" className="ml-2 block text-sm text-gray-900">Disponible à l'emprunt</label>
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800"
        >
          {isEditMode ? 'Modifier' : 'Ajouter'}
        </button>
      </div>
    </form>
  );
};

export default BookForm;