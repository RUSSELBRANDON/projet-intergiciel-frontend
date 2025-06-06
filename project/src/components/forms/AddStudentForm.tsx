import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';

interface StudentFormData {
    name: string;
    email: string;
    sex: React.ReactNode;
    age: React.ReactNode;
    address: string;
    level: string;
    subjects: string[];
    registration_number: string;
    date_of_birth: string;
    phone: string;
    classroom_id: string;
    year_id: string;
}

export function AddStudentForm() {
    const { currentUser } = useAuth();
    const { addStudent } = useData();
    const { register, handleSubmit, formState: { errors } } = useForm<StudentFormData>();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: StudentFormData) => {
        setLoading(true);
        try {
            await addStudent(data);
        } catch (error) {
            console.error('Add student error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                    {...register('name', { required: 'Name is required' })}
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                    {...register('email', { required: 'Email is required', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' } })}
                    type="email"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div>
                <label htmlFor="registration_number" className="block text-sm font-medium text-gray-700">Registration Number</label>
                <input
                    {...register('registration_number', { required: 'Registration number is required' })}
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.registration_number && <p className="mt-1 text-sm text-red-600">{errors.registration_number.message}</p>}
            </div>

            <div>
                <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input
                    {...register('date_of_birth', { required: 'Date of birth is required' })}
                    type="date"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.date_of_birth && <p className="mt-1 text-sm text-red-600">{errors.date_of_birth.message}</p>}
            </div>

            <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                <textarea
                    {...register('address')}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>

            <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                    {...register('phone')}
                    type="tel"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>

            <div>
                <label htmlFor="classroom_id" className="block text-sm font-medium text-gray-700">Classroom</label>
                <select
                    {...register('classroom_id', { required: 'Classroom is required' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                    <option value="">Select a classroom</option>
                    {/* Options will be populated from API */}
                </select>
                {errors.classroom_id && <p className="mt-1 text-sm text-red-600">{errors.classroom_id.message}</p>}
            </div>

            <div>
                <label htmlFor="year_id" className="block text-sm font-medium text-gray-700">Year</label>
                <select
                    {...register('year_id', { required: 'Year is required' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                    <option value="">Select a year</option>
                    {/* Options will be populated from API */}
                </select>
                {errors.year_id && <p className="mt-1 text-sm text-red-600">{errors.year_id.message}</p>}
            </div>

            <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
                {loading ? 'Loading...' : 'Add Student'}
            </button>
        </form>
    );
}
