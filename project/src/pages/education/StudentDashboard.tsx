import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Award, FileText } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import Navbar from '../../components/layout/Navbar';

const StudentDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { students, courses } = useData();
  
  // Trouver les données de l'élève actuel
  const studentData = students.find(student => student.email === currentUser?.email);
  
  // Calculer la moyenne générale
  const calculateAverage = () => {
    if (!studentData || Object.keys(studentData.grades).length === 0) return 0;
    
    const gradeValues = Object.values(studentData.grades);
    const sum = gradeValues.reduce((acc, val) => acc + val, 0);
    return sum / gradeValues.length;
  };
  
  const average = calculateAverage();
  
  // Fonction pour déterminer la couleur en fonction de la note
  const getGradeColor = (grade: number) => {
    if (grade >= 16) return 'text-green-600';
    if (grade >= 12) return 'text-blue-600';
    if (grade >= 8) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar type="education" />
      
      <div className="py-24">
        <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Bienvenue, {currentUser?.name}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Consultez vos cours et vos notes
            </p>
          </motion.div>
        </header>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-7xl mx-auto sm:px-6 lg:px-8"
        >
          <div className="px-4 py-5 sm:px-0">
            {/* Carte de profil */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
              <div className="px-4 py-5 sm:px-6 bg-blue-800 text-white">
                <h3 className="text-lg leading-6 font-medium">
                  Profil Étudiant
                </h3>
                <p className="mt-1 max-w-2xl text-sm">
                  Détails et informations personnelles
                </p>
              </div>
              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Nom complet</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{studentData?.name || currentUser?.name}</dd>
                  </div>

               


                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{studentData?.email || currentUser?.email}</dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Niveau</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{studentData?.level || 'Non spécifié'}</dd>
                  </div>
             
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Moyenne générale</dt>
                    <dd className={`mt-1 text-sm font-semibold ${getGradeColor(average)} sm:mt-0 sm:col-span-2`}>
                      {average.toFixed(2)} / 20
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
            
            {/* Section des cours */}
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <BookOpen className="mr-2 h-5 w-5 text-blue-800" />
              Mes Cours
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {studentData?.subjects.map((subjectName) => {
                const courseInfo = courses.find(c => c.name === subjectName);
                return (
                  <motion.div 
                    key={subjectName}
                    whileHover={{ y: -5 }}
                    className="bg-white overflow-hidden shadow rounded-lg"
                  >
                    <div className="px-4 py-5 sm:p-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-2">{subjectName}</h4>
                      <p className="text-sm text-gray-500 mb-4">
                        Enseignant: {courseInfo?.teacher || 'Non assigné'}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Niveau: {courseInfo?.level || 'Non spécifié'}</span>
                        <span className={`text-sm font-semibold ${getGradeColor(studentData?.grades[subjectName] || 0)}`}>
                          Note: {studentData?.grades[subjectName]?.toFixed(2) || 'Non notée'} / 20
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              
              {(!studentData?.subjects || studentData.subjects.length === 0) && (
                <div className="col-span-full text-center py-8 bg-white shadow rounded-lg">
                  <p className="text-gray-500">Aucun cours inscrit</p>
                </div>
              )}
            </div>
            
            {/* Section du relevé de notes */}
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <FileText className="mr-2 h-5 w-5 text-blue-800" />
              Relevé de Notes
            </h3>
            
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cours
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Enseignant
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Note
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Évaluation
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {studentData?.subjects.map((subjectName) => {
                      const courseInfo = courses.find(c => c.name === subjectName);
                      const grade = studentData?.grades[subjectName] || 0;
                      
                      let evaluation = 'Non évalué';
                      if (grade >= 16) evaluation = 'Excellent';
                      else if (grade >= 14) evaluation = 'Très bien';
                      else if (grade >= 12) evaluation = 'Bien';
                      else if (grade >= 10) evaluation = 'Assez bien';
                      else if (grade > 0) evaluation = 'À améliorer';
                      
                      return (
                        <tr key={subjectName}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {subjectName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {courseInfo?.teacher || 'Non assigné'}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${getGradeColor(grade)}`}>
                            {grade > 0 ? `${grade.toFixed(2)} / 20` : 'Non noté'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {evaluation}
                          </td>
                        </tr>
                      );
                    })}
                    
                    {(!studentData?.subjects || studentData.subjects.length === 0) && (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                          Aucun cours inscrit
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {studentData?.subjects && studentData.subjects.length > 0 && (
                <div className="px-6 py-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Award className="h-5 w-5 text-blue-800 mr-2" />
                      <span className="text-sm font-medium text-gray-900">Moyenne générale:</span>
                    </div>
                    <span className={`text-sm font-bold ${getGradeColor(average)}`}>
                      {average.toFixed(2)} / 20
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentDashboard;