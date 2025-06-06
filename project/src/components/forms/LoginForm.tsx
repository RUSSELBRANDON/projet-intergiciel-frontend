import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';

interface LoginFormData {
    email: string;
    password: string;
    remember: boolean;
}

export function LoginForm() {
    const { login } = useAuth();
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: LoginFormData) => {
        setLoading(true);
        try {
            await login(data);
        } catch (error) {
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                    {...register('email', { required: 'Email is required' })}
                    type="email"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input
                    {...register('password', { required: 'Password is required' })}
                    type="password"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
            </div>

            <div className="flex items-center">
                <input
                    {...register('remember')}
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label className="ml-2 block text-sm text-gray-900">Remember me</label>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
                {loading ? 'Loading...' : 'Login'}
            </button>
        </form>
    );
}
