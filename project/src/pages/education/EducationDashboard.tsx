import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Users, BookOpen, School, GraduationCap, Pencil, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import Navbar from '../../components/layout/Navbar';
import Modal from '../../components/shared/Modal';

// Interfaces pour les formulaires
interface TeacherFormData {
  name: string;
  email: string;
  sex: string;
  age: number;
  address: string;
}

interface StudentFormData {
  name: string;
  email: string;
  sex: string;
  age: number;
  address: string;
}

interface ClassroomFormData {
  label: string;
  capacity: number;
}

interface CourseFormData {
  day: string;
  hour_start: string;
  hour_end: string;
  user_id: string; // Pour l'enseignant (teacher)
  subject_id: string;
  classroom_id: string;
}

interface SubjectFormData {
  label: string;
}

// Composant StudentForm
interface StudentFormProps {
  studentForm: StudentFormData;
  handleStudentChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleStudentSubmit: (e: React.FormEvent) => Promise<void>;
  onCancel: () => void;
  isEditMode: boolean; // Ajout de la prop isEditMode
}

const StudentForm: React.FC<StudentFormProps> = ({
  studentForm,
  handleStudentChange,
  handleStudentSubmit,
  onCancel,
  isEditMode, // Déstructuration de la prop
}) => {
  return (
    <form onSubmit={handleStudentSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom</label>
        <input
          type="text"
          id="name"
          name="name"
          value={studentForm.name}
          onChange={handleStudentChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
          required
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={studentForm.email}
          onChange={handleStudentChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
          required
        />
      </div>
      <div>
        <label htmlFor="sex" className="block text-sm font-medium text-gray-700">Sexe</label>
        <select
          id="sex"
          name="sex"
          value={studentForm.sex}
          onChange={handleStudentChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
          required
        >
          <option value="">Sélectionnez</option>
          <option value="Masculin">Masculin</option>
          <option value="Féminin">Féminin</option>
          <option value="Autre">Autre</option>
        </select>
      </div>
      <div>
        <label htmlFor="age" className="block text-sm font-medium text-gray-700">Âge</label>
        <input
          type="number"
          id="age"
          name="age"
          value={studentForm.age}
          onChange={handleStudentChange}
          min="1"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
          required
        />
      </div>
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Adresse</label>
        <input
          type="text"
          id="address"
          name="address"
          value={studentForm.address}
          onChange={handleStudentChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
          required
        />
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
          {isEditMode ? 'Modifier' : 'Ajouter'} {/* <-- LA LIGNE CLÉ MODIFIÉE */}
        </button>
      </div>
    </form>
  );
};

const EducationDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const {
    teachers,
    students,
    classrooms,
    courses,
    subjects,
    fetchTeachers,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    fetchStudents,
    addStudent,
    updateStudent,
    deleteStudent,
    fetchClassrooms,
    addClassroom,
    updateClassroom,
    deleteClassroom,
    fetchCourses,
    addCourse,
    updateCourse,
    deleteCourse,
    fetchSubjects,
    addSubject,
    updateSubject,
    deleteSubject,
  } = useData();

  const [activeTab, setActiveTab] = useState('teachers');
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // États pour les formulaires
  const [teacherForm, setTeacherForm] = useState<TeacherFormData>({ name: '', email: '', sex: '', age: 18, address: '' });
  const [studentForm, setStudentForm] = useState<StudentFormData>({ name: '', email: '', sex: '', age: 18, address: '' });
  const [classroomForm, setClassroomForm] = useState<ClassroomFormData>({ label: '', capacity: 30 });
  const [courseForm, setCourseForm] = useState<CourseFormData>({ day: '', hour_start: '', hour_end: '', user_id: '', subject_id: '', classroom_id: '' });
  const [subjectForm, setSubjectForm] = useState<SubjectFormData>({ label: '' });

  // Charger les données au montage
  useEffect(() => {
    fetchTeachers();
    fetchStudents();
    fetchClassrooms();
    fetchCourses();
    fetchSubjects();
  }, [fetchTeachers, fetchStudents, fetchClassrooms, fetchCourses, fetchSubjects]);

  // Gestion des changements dans les formulaires
  const handleTeacherChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.name === 'age' ? parseInt(e.target.value) : e.target.value;
    setTeacherForm({ ...teacherForm, [e.target.name]: value });
  };

  const handleStudentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.name === 'age' ? parseInt(e.target.value) : e.target.value;
    setStudentForm({ ...studentForm, [e.target.name]: value });
  };

  const handleClassroomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClassroomForm({
      ...classroomForm,
      [e.target.name]: e.target.name === 'capacity' ? parseInt(e.target.value) : e.target.value,
    });
  };

  const handleCourseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCourseForm({ ...courseForm, [e.target.name]: e.target.value });
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubjectForm({ ...subjectForm, [e.target.name]: e.target.value });
  };

  // Préparer l'édition
  const handleEdit = (entity: any, tab: string) => {
    setEditingId(entity.id);
    setIsEditMode(true);
    switch (tab) {
      case 'teachers':
        setTeacherForm({
          name: entity.name,
          email: entity.email,
          sex: entity.sex,
          age: entity.age,
          address: entity.address,
        });
        break;
      case 'students':
        setStudentForm({
          name: entity.name,
          email: entity.email,
          sex: entity.sex,
          age: entity.age,
          address: entity.address,
        });
        break;
      case 'classrooms':
        setClassroomForm({ label: entity.label, capacity: entity.capacity });
        break;
      case 'courses':
        setCourseForm({
          day: entity.day,
          hour_start: entity.hour_start,
          hour_end: entity.hour_end,
          user_id: entity.user_id,
          subject_id: entity.subject_id,
          classroom_id: entity.classroom_id,
        });
        break;
      case 'subjects':
        setSubjectForm({ label: entity.label });
        break;
    }
    setShowModal(true);
  };

  // Réinitialiser les formulaires
  const resetForms = () => {
    setTeacherForm({ name: '', email: '', sex: '', age: 18, address: '' });
    setStudentForm({ name: '', email: '', sex: '', age: 18, address: '' });
    setClassroomForm({ label: '', capacity: 30 });
    setCourseForm({ day: '', hour_start: '', hour_end: '', user_id: '', subject_id: '', classroom_id: '' });
    setSubjectForm({ label: '' });
    setEditingId(null);
    setIsEditMode(false);
    setError(null);
  };

  // Gestion des soumissions
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (isEditMode && editingId) {
        switch (activeTab) {
          case 'teachers':
            await updateTeacher(editingId, teacherForm);
            break;
          case 'students':
            await updateStudent(editingId, studentForm);
            break;
          case 'classrooms':
            await updateClassroom(editingId, classroomForm);
            break;
          case 'courses':
            await updateCourse(editingId, courseForm);
            break;
          case 'subjects':
            await updateSubject(editingId, subjectForm);
            break;
        }
      } else {
        switch (activeTab) {
          case 'teachers':
            await addTeacher(teacherForm);
            break;
          case 'students':
            await addStudent(studentForm);
            break;
          case 'classrooms':
            await addClassroom(classroomForm);
            break;
          case 'courses':
            await addCourse(courseForm);
            break;
          case 'subjects':
            await addSubject(subjectForm);
            break;
        }
      }
      setShowModal(false);
      resetForms();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la sauvegarde');
    }
  };

  // Gestion des suppressions
  const handleDelete = async (id: string, tab: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ?')) return;
    setError(null);
    try {
      switch (tab) {
        case 'teachers':
          await deleteTeacher(id);
          break;
        case 'students':
          await deleteStudent(id);
          break;
        case 'classrooms':
          await deleteClassroom(id);
          break;
        case 'courses':
          await deleteCourse(id);
          break;
        case 'subjects':
          await deleteSubject(id);
          break;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  // Rendu des formulaires
  const renderForm = () => {
    switch (activeTab) {
      case 'teachers':
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom</label>
              <input
                type="text"
                id="name"
                name="name"
                value={teacherForm.name}
                onChange={handleTeacherChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={teacherForm.email}
                onChange={handleTeacherChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
                required
              />
            </div>
            <div>
              <label htmlFor="sex" className="block text-sm font-medium text-gray-700">Sexe</label>
              <select
                id="sex"
                name="sex"
                value={teacherForm.sex}
                onChange={handleTeacherChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
                required
              >
                <option value="">Sélectionnez</option>
                <option value="Masculin">Masculin</option>
                <option value="Féminin">Féminin</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700">Âge</label>
              <input
                type="number"
                id="age"
                name="age"
                value={teacherForm.age}
                onChange={handleTeacherChange}
                min="1"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
                required
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Adresse</label>
              <input
                type="text"
                id="address"
                name="address"
                value={teacherForm.address}
                onChange={handleTeacherChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => { setShowModal(false); resetForms(); }}
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
      case 'students':
        return (
          <StudentForm
            studentForm={studentForm}
            handleStudentChange={handleStudentChange}
            handleStudentSubmit={handleSubmit}
            onCancel={() => { setShowModal(false); resetForms(); }}
            isEditMode={isEditMode} // Assurez-vous que cette prop est bien passée
          />
        );
      case 'classrooms':
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="label" className="block text-sm font-medium text-gray-700">Nom de la salle</label>
              <input
                type="text"
                id="label"
                name="label"
                value={classroomForm.label}
                onChange={handleClassroomChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
                required
              />
            </div>
            <div>
              <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">Capacité</label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={classroomForm.capacity}
                onChange={handleClassroomChange}
                min="1"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => { setShowModal(false); resetForms(); }}
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
      case 'courses':
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="day" className="block text-sm font-medium text-gray-700">Jour</label>
              <select
                id="day"
                name="day"
                value={courseForm.day}
                onChange={handleCourseChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
                required
              >
                <option value="">Sélectionnez un jour</option>
                <option value="Lundi">Lundi</option>
                <option value="Mardi">Mardi</option>
                <option value="Mercredi">Mercredi</option>
                <option value="Jeudi">Jeudi</option>
                <option value="Vendredi">Vendredi</option>
                <option value="Samedi">Samedi</option>
                <option value="Dimanche">Dimanche</option>
              </select>
            </div>
            <div>
              <label htmlFor="hour_start" className="block text-sm font-medium text-gray-700">Heure de début</label>
              <input
                type="time"
                id="hour_start"
                name="hour_start"
                value={courseForm.hour_start}
                onChange={handleCourseChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
                required
              />
            </div>
            <div>
              <label htmlFor="hour_end" className="block text-sm font-medium text-gray-700">Heure de fin</label>
              <input
                type="time"
                id="hour_end"
                name="hour_end"
                value={courseForm.hour_end}
                onChange={handleCourseChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
                required
              />
            </div>
            <div>
              <label htmlFor="user_id" className="block text-sm font-medium text-gray-700">Enseignant</label>
              <select
                id="user_id"
                name="user_id"
                value={courseForm.user_id}
                onChange={handleCourseChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
                required
              >
                <option value="">Sélectionnez un enseignant</option>
                {teachers.map((teacher: any) => ( // Ajoutez ': any' si votre interface Teacher n'est pas complète
                  <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="subject_id" className="block text-sm font-medium text-gray-700">Matière</label>
              <select
                id="subject_id"
                name="subject_id"
                value={courseForm.subject_id}
                onChange={handleCourseChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
                required
              >
                <option value="">Sélectionnez une matière</option>
                {subjects.map((subject: any) => ( // Ajoutez ': any' si votre interface Subject n'est pas complète
                  <option key={subject.id} value={subject.id}>{subject.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="classroom_id" className="block text-sm font-medium text-gray-700">Salle</label>
              <select
                id="classroom_id"
                name="classroom_id"
                value={courseForm.classroom_id}
                onChange={handleCourseChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
                required
              >
                <option value="">Sélectionnez une salle</option>
                {classrooms.map((classroom: any) => ( // Ajoutez ': any' si votre interface Classroom n'est pas complète
                  <option key={classroom.id} value={classroom.id}>{classroom.label}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => { setShowModal(false); resetForms(); }}
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
      case 'subjects':
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="label" className="block text-sm font-medium text-gray-700">Nom de la matière</label>
              <input
                type="text"
                id="label"
                name="label"
                value={subjectForm.label}
                onChange={handleSubjectChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => { setShowModal(false); resetForms(); }}
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
      default:
        return null;
    }
  };

  // Rendu du contenu des onglets
  const renderTabContent = () => {
    switch (activeTab) {
      case 'teachers':
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sexe</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Âge</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adresse</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {teachers.map((teacher: any) => ( // Ajoutez ': any' si votre interface Teacher n'est pas complète
                  <tr key={teacher.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{teacher.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.sex}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.age}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.address}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleEdit(teacher, 'teachers')}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(teacher.id, 'teachers')}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {teachers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">Aucun enseignant trouvé</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );
      case 'students':
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sexe</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Âge</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adresse</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student: any) => ( // Ajoutez ': any' si votre interface Student n'est pas complète
                  <tr key={student.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.sex}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.age}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.address}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleEdit(student, 'students')}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(student.id, 'students')}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">Aucun élève trouvé</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );
      case 'classrooms':
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacité</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {classrooms.map((classroom: any) => ( // Ajoutez ': any' si votre interface Classroom n'est pas complète
                  <tr key={classroom.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{classroom.label}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{classroom.capacity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleEdit(classroom, 'classrooms')}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(classroom.id, 'classrooms')}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {classrooms.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">Aucune salle de classe trouvée</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );
      case 'courses':
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jour</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Début</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fin</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enseignant</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matière</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salle</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {courses.map((course: any) => ( // Ajoutez ': any' si votre interface Course n'est pas complète
                  <tr key={course.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{course.day}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.hour_start}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.hour_end}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teachers.find((t: any) => t.id === course.user_id)?.name || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{subjects.find((s: any) => s.id === course.subject_id)?.label || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{classrooms.find((c: any) => c.id === course.classroom_id)?.label || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleEdit(course, 'courses')}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(course.id, 'courses')}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {courses.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">Aucun cours trouvé</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );
      case 'subjects':
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom de la matière</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subjects.map((subject: any) => ( // Ajoutez ': any' si votre interface Subject n'est pas complète
                  <tr key={subject.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{subject.label}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleEdit(subject, 'subjects')}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(subject.id, 'subjects')}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {subjects.length === 0 && (
                  <tr>
                    <td colSpan={2} className="px-6 py-4 text-center text-sm text-gray-500">Aucune matière trouvée</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar type="education" withSearch={false} />

      <div className="flex flex-1 overflow-hidden pt-16">
        {/* Sidebar pour la navigation entre les onglets */}
        <aside className="w-64 bg-white shadow-md p-4 flex-shrink-0">
          <nav className="space-y-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('teachers')}
              className={`flex items-center w-full px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'teachers' ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <Users className="mr-3 h-5 w-5" />
              Enseignants
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('students')}
              className={`flex items-center w-full px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'students' ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <GraduationCap className="mr-3 h-5 w-5" />
              Élèves
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('classrooms')}
              className={`flex items-center w-full px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'classrooms' ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <School className="mr-3 h-5 w-5" />
              Salles de Classe
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('courses')}
              className={`flex items-center w-full px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'courses' ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <BookOpen className="mr-3 h-5 w-5" />
              Cours
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('subjects')}
              className={`flex items-center w-full px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'subjects' ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <BookOpen className="mr-3 h-5 w-5" /> {/* Peut-être une icône différente pour les matières si disponible */}
              Matières
            </motion.button>
          </nav>
        </aside>

        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <div className="sm:flex sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                  {activeTab === 'teachers' && 'Gestion des Enseignants'}
                  {activeTab === 'students' && 'Gestion des Élèves'}
                  {activeTab === 'classrooms' && 'Gestion des Salles de Classe'}
                  {activeTab === 'courses' && 'Gestion des Cours'}
                  {activeTab === 'subjects' && 'Gestion des Matières'}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {activeTab === 'teachers' && 'Ajoutez, modifiez ou supprimez les informations des enseignants.'}
                  {activeTab === 'students' && 'Gérez les détails des élèves inscrits.'}
                  {activeTab === 'classrooms' && 'Organisez et gérez les salles de classe.'}
                  {activeTab === 'courses' && 'Planifiez et gérez les cours.'}
                  {activeTab === 'subjects' && 'Créez et gérez les matières enseignées.'}
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setShowModal(true); resetForms(); }}
                className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800"
              >
                <Plus className="-ml-1 mr-2 h-5 w-5" />
                Ajouter {activeTab === 'teachers' && 'un enseignant'}
                {activeTab === 'students' && 'un élève'}
                {activeTab === 'classrooms' && 'une salle'}
                {activeTab === 'courses' && 'un cours'}
                {activeTab === 'subjects' && 'une matière'}
              </motion.button>
            </div>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded"
            >
              {error}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white shadow overflow-hidden sm:rounded-lg"
          >
            <div className="px-4 py-5 sm:p-6">
              {renderTabContent()}
            </div>
          </motion.div>
        </main>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); resetForms(); }}
        title={isEditMode ? `Modifier ${activeTab === 'teachers' ? 'un enseignant' : activeTab === 'students' ? 'un élève' : activeTab === 'classrooms' ? 'une salle' : activeTab === 'courses' ? 'un cours' : 'une matière'}` : `Ajouter ${activeTab === 'teachers' ? 'un enseignant' : activeTab === 'students' ? 'un élève' : activeTab === 'classrooms' ? 'une salle' : activeTab === 'courses' ? 'un cours' : 'une matière'}`}
      >
        {renderForm()}
      </Modal>
    </div>
  );
};

export default EducationDashboard;