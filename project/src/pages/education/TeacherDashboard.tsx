import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, Users, Save } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import Navbar from '../../components/layout/Navbar';

const TeacherDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { students, courses, updateGrade } = useData();
  
  // Trouver les cours enseignés par cet enseignant
  const teacherCourses = courses.filter(course => course.teacher === currentUser?.name);
  
  // Trouver les élèves qui suivent ces cours
  const relevantStudents = students.filter(student => 
    student.subjects.some(subject => 
      teacherCourses.some(course => course.name === subject)
    )
  );
  
  // État pour stocker les notes temporaires avant soumission
  const [tempGrades, setTempGrades] = useState<Record<string, Record<string, number>>>({});
  const [successMessage, setSuccessMessage] = useState('');
  
  // Fonction pour gérer le changement de note
  const handleGradeChange = (studentId: string, subject: string, grade: string) => {
    const numericGrade = parseFloat(grade);
    
    if (isNaN(numericGrade) || numericGrade < 0 || numericGrade > 20) {
      return; // Valeur invalide
    }
    
    setTempGrades(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        [subject]: numericGrade
      }
    }));
  };
  
  // Fonction pour soumettre les notes
  const handleSubmitGrades = () => {
    // Parcourir toutes les notes temporaires et les soumettre
    Object.entries(tempGrades).forEach(([studentId, subjects]) => {
      Object.entries(subjects).forEach(([subject, grade]) => {
        updateGrade(studentId, subject, grade);
      });
    });
    
    // Réinitialiser les notes temporaires
    setTempGrades({});
    
    // Afficher un message de succès
    setSuccessMessage('Les notes ont été enregistrées avec succès.');
    
    // Faire disparaître le message après 3 secondes
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };
  
  // Fonction pour obtenir la note d'un élève pour une matière
  const getGrade = (student: typeof students[0], subject: string) => {
    // Vérifier d'abord si une note temporaire existe
    if (tempGrades[student.id]?.[subject] !== undefined) {
      return tempGrades[student.id][subject];
    }
    
    // Sinon, retourner la note enregistrée ou 0
    return student.grades[subject] || 0;
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar type="education" />
      
      {/* Ajout du padding-top ici */}
      <div className="pt-[150px]">
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
              Gérez vos cours et notez vos élèves
            </p>
          </motion.div>
        </header>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-7xl mx-auto sm:px-6 lg:px-8"
        >
          {/* Message de succès */}
          {successMessage && (
            <div className="mb-4 px-4 sm:px-0">
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 border-l-4 border-green-500 p-4"
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">
                      {successMessage}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
          
          {/* Section des cours */}
          <div className="px-4 py-5 sm:px-0">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <BookOpen className="mr-2 h-5 w-5 text-blue-800" />
              Mes Cours
            </h3>
            
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
              <ul className="divide-y divide-gray-200">
                {teacherCourses.map((course) => (
                  <li key={course.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{course.name}</h4>
                        <p className="text-sm text-gray-500">Niveau: {course.level}</p>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {relevantStudents.filter(s => s.subjects.includes(course.name)).length} élèves
                      </span>
                    </div>
                  </li>
                ))}
                {teacherCourses.length === 0 && (
                  <li className="px-6 py-4 text-center text-gray-500">
                    Aucun cours assigné
                  </li>
                )}
              </ul>
            </div>
            
            {/* Section des élèves et notes */}
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Users className="mr-2 h-5 w-5 text-blue-800" />
              Mes Élèves et Notes
            </h3>
            
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Élève
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Niveau
                      </th>
                      {teacherCourses.map((course) => (
                        <th key={course.id} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {course.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {relevantStudents.map((student) => (
                      <tr key={student.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {student.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.level}
                        </td>
                        {teacherCourses.map((course) => (
                          <td key={course.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.subjects.includes(course.name) ? (
                              <input
                                type="number"
                                min="0"
                                max="20"
                                step="0.5"
                                value={getGrade(student, course.name)}
                                onChange={(e) => handleGradeChange(student.id, course.name, e.target.value)}
                                className="w-16 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-800 focus:border-blue-800"
                              />
                            ) : (
                              <span className="text-gray-400">N/A</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                    {relevantStudents.length === 0 && (
                      <tr>
                        <td colSpan={2 + teacherCourses.length} className="px-6 py-4 text-center text-sm text-gray-500">
                          Aucun élève inscrit à vos cours
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {relevantStudents.length > 0 && (
                <div className="px-6 py-4 bg-gray-50 flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSubmitGrades}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800"
                    disabled={Object.keys(tempGrades).length === 0}
                  >
                    <Save className="-ml-1 mr-2 h-5 w-5" />
                    Enregistrer les notes
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TeacherDashboard;