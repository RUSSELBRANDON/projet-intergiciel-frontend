import React, { createContext, useContext, useState, useEffect } from 'react';
   import { useNavigate } from 'react-router-dom';
   import axios from 'axios';

   interface User {
     id: string;
     name: string;
     email: string;
     role: 'admin' | 'teacher' | 'student';
     type: 'education' | 'library';
   }

   interface AuthContextType {
     currentUser: User | null;
     login: (email: string, password: string, type: 'education' | 'library') => Promise<void>;
     register: (name: string, email: string, password: string, type: 'education' | 'library') => Promise<void>;
     logout: () => void;
     sendPasswordResetEmail: (email: string, type: 'education' | 'library') => Promise<void>;
     verifyOtp: (email: string, otp: string, type: 'education' | 'library') => Promise<string>;
resetPassword: (email: string, token: string, newPassword: string, type: 'education' | 'library') => Promise<void>;   }

   const AuthContext = createContext<AuthContextType | undefined>(undefined);

   export function useAuth() {
     const context = useContext(AuthContext);
     if (!context) {
       throw new Error('useAuth must be used within an AuthProvider');
     }
     return context;
   }

   export function AuthProvider({ children }: { children: React.ReactNode }) {
     const [currentUser, setCurrentUser] = useState<User | null>(null);
     const navigate = useNavigate();

     useEffect(() => {
       const token = localStorage.getItem('token');
       if (token) {
         axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
       }
     }, []);

     useEffect(() => {
       const savedUser = localStorage.getItem('currentUser');
       if (savedUser && savedUser !== 'undefined') {
         try {
           setCurrentUser(JSON.parse(savedUser));
         } catch (error) {
           console.error('Erreur lors du parsing de currentUser:', error);
           localStorage.removeItem('currentUser');
         }
       }
     }, []);

     const login = async (email: string, password: string, type: 'education' | 'library') => {
       try {
         const apiUrl = type === 'education' ? 'http://localhost:8001/api' : 'http://localhost:8005/api';
         console.log('Envoi login:', { email, password, type, apiUrl });
         const response = await axios.post(`${apiUrl}/auth/login`, {
           email,
           password,
           type,
         });
         console.log('Réponse login:', response.data);

         const { user, token } = response.data;
         setCurrentUser(user);
         localStorage.setItem('currentUser', JSON.stringify(user));
         localStorage.setItem('token', token);

         if (type === 'education') {
           switch (user.role) {
             case 'admin':
               navigate('/education/admin');
               break;
             case 'teacher':
               navigate('/education/teacher');
               break;
             case 'student':
               navigate('/education/student');
               break;
             default:
               navigate('/education/home');
               break;
           }
         } else {
           switch (user.role) {
             case 'admin':
               navigate('/library/admin');
               break;
             default:
               navigate('/library/home');
               break;
           }
         }
       } catch (error: any) {
         console.error('Erreur login:', error.response?.data || error.message);
         throw new Error(error.response?.data?.message || 'Email ou mot de passe incorrect');
       }
     };

     const register = async (name: string, email: string, password: string, type: 'education' | 'library') => {
       try {
         const apiUrl = type === 'education' ? 'http://localhost:8001/api' : 'http://localhost:8005/api';
         const response = await axios.post(`${apiUrl}/auth/register`, {
           name,
           email,
           password,
           type,
         });

         const { user, token } = response.data;
         setCurrentUser(user);
         localStorage.setItem('currentUser', JSON.stringify(user));
         localStorage.setItem('token', token);

         if (type === 'education') {
           navigate(user.role === 'admin' ? '/education/admin' : '/education/home');
         } else {
           navigate('/library/home');
         }
       } catch (error: any) {
         throw new Error(error.response?.data?.message || "Une erreur est survenue lors de l'inscription.");
       }
     };

     const logout = async () => {
       try {
         const savedUser = localStorage.getItem('currentUser');
         const user = savedUser && savedUser !== 'undefined' ? JSON.parse(savedUser) : null;
         const apiUrl = user?.type === 'education' ? 'http://localhost:8001/api' : 'http://localhost:8005/api';
         await axios.post(`${apiUrl}/auth/logout`);
         setCurrentUser(null);
         localStorage.removeItem('currentUser');
         localStorage.removeItem('token');
         delete axios.defaults.headers.common['Authorization'];
         navigate('/');
       } catch (error) {
         console.error('Erreur lors de la déconnexion:', error);
       }
     };

     const sendPasswordResetEmail = async (email: string, type: 'education' | 'library') => {
       try {
         const apiUrl = type === 'education' ? 'http://localhost:8001/api' : 'http://localhost:8005/api';
         await axios.post(`${apiUrl}/password/sendCode`, { email });
       } catch (error: any) {
         throw new Error(error.response?.data?.message || "Erreur lors de l'envoi de l'email de réinitialisation.");
       }
     };

     const verifyOtp = async (email: string, otp: string, type: 'education' | 'library') => {
        try {
            const apiUrl = type === 'education' ? 'http://localhost:8001/api' : 'http://localhost:8005/api';
            const response = await axios.post(`${apiUrl}/password/verificationCode`, { email, code: otp });
            console.log(response);
            return response.data.token; // Attendre un champ 'token' dans la réponse
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Code OTP invalide.');
        }
    };
    const resetPassword = async (email: string, token: string, new_password: string, type: 'education' | 'library') => {
       try {
           console.log(email, token, new_password);
           const apiUrl = type === 'education' ? 'http://localhost:8001/api' : 'http://localhost:8005/api';
           await axios.post(`${apiUrl}/password/reset`, { email, token, new_password });
           
           // Redirection dynamique en fonction du type
           const redirectPath = type === 'education' ? '/login/education' : '/login/library';
           navigate(redirectPath);
       } catch (error: any) {
           throw new Error(error.response?.data?.message || 'Erreur lors de la réinitialisation du mot de passe.');
       }
   };

     const value = {
       currentUser,
       login,
       register,
       logout,
       sendPasswordResetEmail,
       verifyOtp,
       resetPassword,
     };

     return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
   }