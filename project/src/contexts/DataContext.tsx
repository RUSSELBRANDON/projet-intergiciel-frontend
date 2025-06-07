import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import axios from 'axios';

// Types
interface Teacher {
  id: string;
  name: string;
  email: string;
  sex: string;
  age: number;
  address: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
  sex: string;
  age: number;
  address: string;
}

interface Classroom {
  id: string;
  label: string;
  capacity: number;
}

interface Course {
  id: string;
  day: string;
  hour_start: string;
  hour_end: string;
  user_id: string;
  subject_id: string;
  classroom_id: string;
}

interface Subject {
  id: string;
  label: string;
}

interface Book {
  id: string;
  title: string;
  author: string;
  publication_date?: string;
  genre?: string;
  available: boolean;
  owner_id?: string;
}

interface Loan {
  id: string;
  bookId: string;
  userId: string;
  loanDate: string;
  returnDate: string;
  returned: boolean;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  requesterName: string;
  bookTitle: string;
  borrowerName: string;
  lenderName: string;
  requestDate: string;
}

interface DataContextType {
  teachers: Teacher[];
  students: Student[];
  classrooms: Classroom[];
  courses: Course[];
  subjects: Subject[];
  books: Book[];
  loans: Loan[];
  fetchTeachers: () => Promise<void>;
  addTeacher: (teacher: Omit<Teacher, 'id'>) => Promise<void>;
  updateTeacher: (id: string, teacher: Partial<Teacher>) => Promise<void>;
  deleteTeacher: (id: string) => Promise<void>;
  fetchStudents: () => Promise<void>;
  addStudent: (student: Omit<Student, 'id'>) => Promise<void>;
  updateStudent: (id: string, student: Partial<Student>) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  fetchClassrooms: () => Promise<void>;
  addClassroom: (classroom: Omit<Classroom, 'id'>) => Promise<void>;
  updateClassroom: (id: string, classroom: Partial<Classroom>) => Promise<void>;
  deleteClassroom: (id: string) => Promise<void>;
  fetchCourses: () => Promise<void>;
  addCourse: (course: Omit<Course, 'id'>) => Promise<void>;
  updateCourse: (id: string, course: Partial<Course>) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  fetchSubjects: () => Promise<void>;
  addSubject: (subject: Omit<Subject, 'id'>) => Promise<void>;
  updateSubject: (id: string, subject: Partial<Subject>) => Promise<void>;
  deleteSubject: (id: string) => Promise<void>;
  fetchBooks: () => Promise<void>;
  fetchUserBooks: (userId: string) => Promise<Book[]>;
  addBook: (book: Omit<Book, 'id'>, userId: string) => Promise<void>;
  updateBook: (id: string, book: Partial<Book>) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  borrowBook: (bookId: string, userId: string, returnDate: string) => Promise<void>;
  returnBook: (loanId: string) => Promise<void>;
  handleLoanRequest: (bookId: string, userId: string) => Promise<void>;
  handleLoanResponse: (requestId: string, action: 'approve' | 'reject') => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);

  const getHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');
    return { Authorization: `Bearer ${token}` };
  };

  // Teachers CRUD
  const fetchTeachers = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8002/api/teacher/index', { headers: getHeaders() });
      const teacherData = Array.isArray(response.data) ? response.data : response.data.data || [];
      const mappedTeachers: Teacher[] = teacherData.map((teacher: any) => ({
        id: teacher.id.toString(),
        name: teacher.name,
        email: teacher.email,
        sex: teacher.sex,
        age: parseInt(teacher.age),
        address: teacher.address,
      }));
      setTeachers(mappedTeachers);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  }, []);

  const addTeacher = async (teacher: Omit<Teacher, 'id'>) => {
   try {
  const response = await axios.post('http://localhost:8002/api/teacher/store', teacher, { headers: getHeaders() });
      setTeachers([...teachers, { id: response.data.teacher.id.toString(), ...teacher }]); // Ajusté pour correspondre à la réponse API
    } catch (error: any) {
      console.error('Error adding teacher:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de l\'ajout de l\'enseignant');
    }
  };

  const updateTeacher = async (id: string, updatedTeacher: Partial<Teacher>) => {
    try {
      await axios.put(`http://localhost:8002/api/teacher/update/${id}`, updatedTeacher, { headers: getHeaders() });
      setTeachers(teachers.map(t => (t.id === id ? { ...t, ...updatedTeacher } : t)));
    } catch (error) {
      console.error('Error updating teacher:', error);
      throw error;
    }
  };

  const deleteTeacher = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8002/api/teacher/delete/${id}`, { headers: getHeaders() });
      setTeachers(teachers.filter(t => t.id !== id));
    } catch (error: any) {
      console.error('Error deleting teacher:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la suppression de l\'enseignant');
    }
  };

  // Students CRUD
  const fetchStudents = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8003/api/student/index', { headers: getHeaders() });
      const studentData = Array.isArray(response.data) ? response.data : response.data.data || [];
      const mappedStudents: Student[] = studentData.map((student: any) => ({
        id: student.id.toString(),
        name: student.name,
        email: student.email,
        sex: student.sex,
        age: parseInt(student.age),
        address: student.address,
      }));
      setStudents(mappedStudents);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  }, []);

  const addStudent = async (student: Omit<Student, 'id'>) => {
    try {
      const response = await axios.post('http://localhost:8003/api/student/store', student, { headers: getHeaders() });
      setStudents([...students, { id: response.data.id.toString(), ...student }]);
    } catch (error) {
      console.error('Error adding student:', error);
      throw error;
    }
  };

  const updateStudent = async (id: string, updatedStudent: Partial<Student>) => {
    try {
      await axios.put(`http://localhost:8003/api/student/update/${id}`, updatedStudent, { headers: getHeaders() });
      setStudents(students.map(s => (s.id === id ? { ...s, ...updatedStudent } : s)));
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  };

  const deleteStudent = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8003/api/student/delete/${id}`, { headers: getHeaders() });
      setStudents(students.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting student:', error);
      throw error;
    }
  };

  // Classrooms CRUD
  const fetchClassrooms = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8002/api/classroom/index', { headers: getHeaders() });
      const classroomData = Array.isArray(response.data) ? response.data : response.data.data || [];
      const mappedClassrooms: Classroom[] = classroomData.map((classroom: any) => ({
        id: classroom.id.toString(),
        label: classroom.label,
        capacity: parseInt(classroom.capacity),
      }));
      setClassrooms(mappedClassrooms);
    } catch (error) {
      console.error('Error fetching classrooms:', error);
    }
  }, []);

  const addClassroom = async (classroom: Omit<Classroom, 'id'>) => {
    try {
      const response = await axios.post('http://localhost:8002/api/classroom/store', classroom, { headers: getHeaders() });
      setClassrooms([...classrooms, { id: response.data.id.toString(), ...classroom }]);
    } catch (error) {
      console.error('Error adding classroom:', error);
      throw error;
    }
  };

  const updateClassroom = async (id: string, updatedClassroom: Partial<Classroom>) => {
    try {
      await axios.put(`http://localhost:8002/api/classroom/update/${id}`, updatedClassroom, { headers: getHeaders() });
      setClassrooms(classrooms.map(c => (c.id === id ? { ...c, ...updatedClassroom } : c)));
    } catch (error) {
      console.error('Error updating classroom:', error);
      throw error;
    }
  };

  const deleteClassroom = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8002/api/classroom/delete/${id}`, { headers: getHeaders() });
      setClassrooms(classrooms.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting classroom:', error);
      throw error;
    }
  };

  // Courses CRUD
  const fetchCourses = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8002/api/course/index', { headers: getHeaders() });
      const courseData = Array.isArray(response.data) ? response.data : response.data.data || [];
      const mappedCourses: Course[] = courseData.map((course: any) => ({
        id: course.id.toString(),
        day: course.day,
        hour_start: course.hour_start,
        hour_end: course.hour_end,
        user_id: course.user_id?.toString(),
        subject_id: course.subject_id?.toString(),
        classroom_id: course.classroom_id?.toString(),
      }));
      setCourses(mappedCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  }, []);

  const addCourse = async (course: Omit<Course, 'id'>) => {
    try {
      const response = await axios.post('http://localhost:8002/api/course/store', course, { headers: getHeaders() });
      setCourses([...courses, { id: response.data.id.toString(), ...course }]);
    } catch (error) {
      console.error('Error adding course:', error);
      throw error;
    }
  };

  const updateCourse = async (id: string, updatedCourse: Partial<Course>) => {
    try {
      await axios.put(`http://localhost:8002/api/course/update/${id}`, updatedCourse, { headers: getHeaders() });
      setCourses(courses.map(c => (c.id === id ? { ...c, ...updatedCourse } : c)));
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  };

  const deleteCourse = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8002/api/course/delete/${id}`, { headers: getHeaders() });
      setCourses(courses.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  };

  // Subjects CRUD
  const fetchSubjects = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8002/api/subject/index', { headers: getHeaders() });
      const subjectData = Array.isArray(response.data) ? response.data : response.data.data || [];
      const mappedSubjects: Subject[] = subjectData.map((subject: any) => ({
        id: subject.id.toString(),
        label: subject.label,
      }));
      setSubjects(mappedSubjects);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  }, []);

  const addSubject = async (subject: Omit<Subject, 'id'>) => {
    try {
      const response = await axios.post('http://localhost:8002/api/subject/store', subject, { headers: getHeaders() });
      setSubjects([...subjects, { id: response.data.id.toString(), ...subject }]);
    } catch (error) {
      console.error('Error adding subject:', error);
      throw error;
    }
  };

  const updateSubject = async (id: string, updatedSubject: Partial<Subject>) => {
    try {
      await axios.put(`http://localhost:8002/api/subject/update/${id}`, updatedSubject, { headers: getHeaders() });
      setSubjects(subjects.map(s => (s.id === id ? { ...s, ...updatedSubject } : s)));
    } catch (error) {
      console.error('Error updating subject:', error);
      throw error;
    }
  };

  const deleteSubject = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8002/api/subject/delete/${id}`, { headers: getHeaders() });
      setSubjects(subjects.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting subject:', error);
      throw error;
    }
  };

  // Books and Loans
  const fetchBooks = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8006/api/ressources/book/index', { headers: getHeaders() });
      const bookData = Array.isArray(response.data) ? response.data : response.data.data || [];
      const mappedBooks: Book[] = bookData.map((book: any) => ({
        id: book.id.toString(),
        title: book.title,
        author: book.author,
        publication_date: book.publication_date,
        genre: book.genre,
        available: book.status === 'available',
        owner_id: book.owner_id?.toString(),
      }));
      setBooks(mappedBooks);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  }, []);

  const fetchUserBooks = useCallback(async (userId: string) => {
    try {
      const response = await axios.get(`http://localhost:8006/api/usecases/user/getbooks/${userId}`, {
        headers: getHeaders(),
      });
      const bookData = Array.isArray(response.data) ? response.data : response.data.data || [];
      const mappedBooks: Book[] = bookData.map((book: any) => ({
        id: book.id.toString(),
        title: book.title,
        author: book.author,
        publication_date: book.publication_date,
        genre: book.genre,
        available: book.status === 'available',
        owner_id: book.owner_id?.toString(),
      }));
      return mappedBooks;
    } catch (error) {
      console.error('Error fetching user books:', error);
      return [];
    }
  }, []);

  const addBook = async (book: Omit<Book, 'id'>, userId: string) => {
    try {
      const bookData = {
        title: book.title,
        author: book.author,
        publication_date: book.publication_date || null,
        genre: book.genre || null,
        status: book.available ? 'available' : 'borrowed',
        owner_id: userId,
      };
      const response = await axios.post('http://localhost:8006/api/ressources/book/store', bookData, {
        headers: getHeaders(),
      });
      const newBook: Book = {
        id: response.data.id.toString(),
        title: response.data.title,
        author: response.data.author,
        publication_date: response.data.publication_date,
        genre: response.data.genre,
        available: response.data.status === 'available',
        owner_id: response.data.owner_id?.toString(),
      };
      setBooks([...books, newBook]);
    } catch (error) {
      console.error('Error adding book:', error);
      throw error;
    }
  };

  const updateBook = async (id: string, book: Partial<Book>) => {
    try {
      const bookData = {
        title: book.title,
        author: book.author,
        publication_date: book.publication_date || null,
        genre: book.genre || null,
        status: book.available ? 'available' : 'borrowed',
      };
      const response = await axios.put(`http://localhost:8006/api/ressources/book/update/${id}`, bookData, {
        headers: getHeaders(),
      });
      const updatedBook: Book = {
        id: response.data.id.toString(),
        title: response.data.title,
        author: response.data.author,
        publication_date: response.data.publication_date,
        genre: response.data.genre,
        available: response.data.status === 'available',
        owner_id: response.data.owner_id?.toString(),
      };
      setBooks(books.map(b => (b.id === id ? updatedBook : b)));
    } catch (error) {
      console.error('Error updating book:', error);
      throw error;
    }
  };

  const deleteBook = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8006/api/ressources/book/delete/${id}`, { headers: getHeaders() });
      setBooks(books.filter(book => book.id !== id));
    } catch (error) {
      console.error('Error deleting book:', error);
      throw error;
    }
  };

  const borrowBook = async (bookId: string, userId: string, returnDate: string) => {
    try {
      await axios.post(`http://localhost:8006/api/usecases/notification/loanrequest/${bookId}/${userId}`, {
        return_date: returnDate,
      }, { headers: getHeaders() });
    } catch (error) {
      console.error('Error requesting loan:', error);
      throw error;
    }
  };

  const returnBook = async (loanId: string) => {
    try {
      const loan = loans.find(l => l.id === loanId);
      if (!loan) return;
      setLoans(loans.map(l => (l.id === loanId ? { ...l, returned: true } : l)));
      setBooks(books.map(book => (book.id === loan.bookId ? { ...book, available: true } : book)));
    } catch (error) {
      console.error('Error returning book:', error);
      throw error;
    }
  };

  const handleLoanRequest = useCallback(async (bookId: string, userId: string) => {
    try {
      const book = books.find(b => b.id === bookId);
      if (!book) throw new Error('Book not found');
      const newLoan: Loan = {
        id: Date.now().toString(),
        bookId,
        userId,
        loanDate: new Date().toISOString(),
        returnDate: '',
        returned: false,
        status: 'pending',
        requesterName: '',
        bookTitle: book.title,
        borrowerName: '',
        lenderName: '',
        requestDate: new Date().toISOString(),
      };
      setLoans(prev => [...prev, newLoan]);
    } catch (error) {
      console.error('Error creating loan request:', error);
      throw error;
    }
  }, [books]);

  const handleLoanResponse = useCallback(async (requestId: string, action: 'approve' | 'reject') => {
    try {
      setLoans(prev => prev.map(loan => {
        if (loan.id === requestId) {
          return {
            ...loan,
            status: action === 'approve' ? 'approved' : 'rejected',
            returnDate: action === 'approve' ? new Date().toISOString() : loan.returnDate,
          };
        }
        return loan;
      }));
    } catch (error) {
      console.error('Error handling loan request:', error);
      throw error;
    }
  }, []);

  useEffect(() => {
    fetchTeachers();
    fetchStudents();
    fetchClassrooms();
    fetchCourses();
    fetchSubjects();
    fetchBooks();
  }, [fetchTeachers, fetchStudents, fetchClassrooms, fetchCourses, fetchSubjects, fetchBooks]);

  const value = {
    teachers,
    students,
    classrooms,
    courses,
    subjects,
    books,
    loans,
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
    fetchBooks,
    fetchUserBooks,
    addBook,
    updateBook,
    deleteBook,
    borrowBook,
    returnBook,
    handleLoanRequest,
    handleLoanResponse,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}