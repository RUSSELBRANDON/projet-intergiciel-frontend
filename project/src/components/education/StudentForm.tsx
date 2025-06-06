import React from 'react';

interface StudentFormProps {
  studentForm: {
    name: string;
    email: string;
    level: string;
    sex: string;
    age: number;
    address: string;
    subjects: string[];
  };
  handleStudentChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleStudentSubjectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleStudentSubmit: (e: React.FormEvent) => void;
  courses: {
    id: string;
    name: string;
    level: string;
  }[];
  onCancel: () => void;
}

const StudentForm: React.FC<StudentFormProps> = ({
  studentForm,
  handleStudentChange,
  handleStudentSubjectChange,
  handleStudentSubmit,
  courses,
  onCancel
}) => {
  return (
    <form onSubmit={handleStudentSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom complet</label>
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

      <div className="grid grid-cols-2 gap-4">
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
            min="6"
            max="25"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="level" className="block text-sm font-medium text-gray-700">Niveau scolaire</label>
        <select
          id="level"
          name="level"
          value={studentForm.level}
          onChange={handleStudentChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
          required
        >
          <option value="">Sélectionnez un niveau</option>
          <option value="CP">CP</option>
          <option value="CE1">CE1</option>
          <option value="CE2">CE2</option>
          <option value="CM1">CM1</option>
          <option value="CM2">CM2</option>
          <option value="6ème">6ème</option>
          <option value="5ème">5ème</option>
          <option value="4ème">4ème</option>
          <option value="3ème">3ème</option>
          <option value="Seconde">Seconde</option>
          <option value="Première">Première</option>
          <option value="Terminale">Terminale</option>
        </select>
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

      <div>
        <label htmlFor="subjects" className="block text-sm font-medium text-gray-700">Matières suivies</label>
        <select
          id="subjects"
          name="subjects"
          multiple
          value={studentForm.subjects}
          onChange={handleStudentSubjectChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
          required
        >
          {courses.map(course => (
            <option key={course.id} value={course.name}>
              {course.name} ({course.level})
            </option>
          ))}
        </select>
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
          Ajouter l'élève
        </button>
      </div>
    </form>
  );
};

export default StudentForm;