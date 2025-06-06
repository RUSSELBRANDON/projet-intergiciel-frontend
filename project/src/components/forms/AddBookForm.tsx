import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { useApi } from '../../contexts/ApiContext';

interface BookFormData {
    title: string;
    author: string;
    isbn: string;
    edition: string;
    publication_year: string;
    quantity: number;
    cover_image: File;
    description: string;
}

export function AddBookForm() {
    const { user } = useAuth();
    const { api } = useApi();
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const { register, handleSubmit, formState: { errors } } = useForm<BookFormData>();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: BookFormData) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('author', data.author);
            formData.append('isbn', data.isbn);
            formData.append('edition', data.edition);
            formData.append('publication_year', data.publication_year);
            formData.append('quantity', data.quantity.toString());
            formData.append('description', data.description);
            if (coverImage) {
                formData.append('cover_image', coverImage);
            }

            await api.post('/ressources/book/store', formData);
        } catch (error) {
            console.error('Add book error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <input
                    {...register('title', { required: 'Title is required' })}
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
            </div>

            <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-700">Author</label>
                <input
                    {...register('author', { required: 'Author is required' })}
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.author && <p className="mt-1 text-sm text-red-600">{errors.author.message}</p>}
            </div>

            <div>
                <label htmlFor="isbn" className="block text-sm font-medium text-gray-700">ISBN</label>
                <input
                    {...register('isbn', { required: 'ISBN is required' })}
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.isbn && <p className="mt-1 text-sm text-red-600">{errors.isbn.message}</p>}
            </div>

            <div>
                <label htmlFor="edition" className="block text-sm font-medium text-gray-700">Edition</label>
                <input
                    {...register('edition')}
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>

            <div>
                <label htmlFor="publication_year" className="block text-sm font-medium text-gray-700">Publication Year</label>
                <input
                    {...register('publication_year', { required: 'Publication year is required' })}
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.publication_year && <p className="mt-1 text-sm text-red-600">{errors.publication_year.message}</p>}
            </div>

            <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
                <input
                    {...register('quantity', { required: 'Quantity is required', min: { value: 1, message: 'Quantity must be at least 1' } })}
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>}
            </div>

            <div>
                <label htmlFor="cover_image" className="block text-sm font-medium text-gray-700">Cover Image</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                            setCoverImage(e.target.files[0]);
                        }
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                    {...register('description')}
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
                {loading ? 'Loading...' : 'Add Book'}
            </button>
        </form>
    );
}
