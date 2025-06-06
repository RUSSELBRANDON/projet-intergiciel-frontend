import React, { useState } from 'react';
   import { Link, useNavigate } from 'react-router-dom';
   import { motion } from 'framer-motion';
   import { useAuth } from '../../contexts/AuthContext';
   import { Mail } from 'lucide-react';
   import { useParams } from 'react-router-dom';

   const EmailResetPage: React.FC = () => {
    const { sendPasswordResetEmail } = useAuth();
    const navigate = useNavigate();
    const { type } = useParams<{ type: 'education' | 'library' }>(); // Récupérer type depuis l'URL
    
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setIsLoading(true);

        if (!email) {
            setError('Veuillez saisir votre adresse e-mail.');
            setIsLoading(false);
            return;
        }

        if (!type || !['education', 'library'].includes(type)) {
            setError('Type de compte invalide.');
            setIsLoading(false);
            return;
        }

        try {
            await sendPasswordResetEmail(email, type);
            setSuccessMessage('Un e-mail de réinitialisation a été envoyé. Veuillez vérifier votre boîte de réception.');
            setTimeout(() => {
                navigate(`/otp-verify/${type}`, { state: { email, type } });
            }, 2000);
        } catch (err: any) {
            setError(err.message || 'Une erreur est survenue lors de l\'envoi de l\'e-mail. Veuillez réessayer.');
            console.error('Email reset error:', err);
        } finally {
            setIsLoading(false);
        }
    };

     return (
       <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
         <div className="sm:mx-auto sm:w-full sm:max-w-md">
           <motion.div
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ duration: 0.5 }}
             className="text-center"
           >
             <div className="h-16 w-16 mx-auto bg-blue-800 text-white flex items-center justify-center rounded-full">
               <Mail className="h-8 w-8" />
             </div>
           </motion.div>
           
           <motion.h2
             initial={{ y: -20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ duration: 0.5, delay: 0.1 }}
             className="mt-6 text-center text-3xl font-extrabold text-gray-900"
           >
             Mot de passe oublié ?
           </motion.h2>
           <motion.p
             initial={{ y: -20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ duration: 0.5, delay: 0.2 }}
             className="mt-2 text-center text-sm text-gray-600 max-w"
           >
             Entrez votre adresse e-mail pour recevoir un code de vérification.
           </motion.p>
         </div>

         <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
           <motion.div
             initial={{ y: 20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ duration: 0.5, delay: 0.3 }}
             className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10"
           >
             <form className="space-y-6" onSubmit={handleSubmit}>
               {error && (
                 <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                   <div className="flex">
                     <div className="flex-shrink-0">
                       <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                         <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                       </svg>
                     </div>
                     <div className="ml-3">
                       <p className="text-sm text-red-700">{error}</p>
                     </div>
                   </div>
                 </div>
               )}
               {successMessage && (
                 <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                   <div className="flex">
                     <div className="flex-shrink-0">
                       <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                       </svg>
                     </div>
                     <div className="ml-3">
                       <p className="text-sm text-green-700">{successMessage}</p>
                     </div>
                   </div>
                 </div>
               )}
               
               <div>
                 <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                   Adresse e-mail
                 </label>
                 <div className="mt-1">
                   <input
                     id="email"
                     name="email"
                     type="email"
                     autoComplete="email"
                     required
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-800 focus:border-blue-800 sm:text-sm"
                     placeholder="vous@example.com"
                   />
                 </div>
               </div>

               <div>
                 <motion.button
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   type="submit"
                   disabled={isLoading || !!successMessage}
                   className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800 disabled:opacity-50"
                 >
                   {isLoading ? (
                     <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                     </svg>
                   ) : (
                     "Envoyer le code"
                   )}
                 </motion.button>
               </div>
             </form>
             
             <div className="mt-6 text-center">
               <Link to="/login/education" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                 ← Retour à la page de connexion
               </Link>
             </div>
           </motion.div>
         </div>
       </div>
     );
   };

   export default EmailResetPage;