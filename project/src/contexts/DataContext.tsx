import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import axios from 'axios';

// Types
interface Teacher {
  id: string;
  name: string;
  email: string;
  subject: string;
  classroom: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
  level: string;
  subjects: string[];
  grades: Record<string, number>;
  sex?: ReactNode;
  age?: ReactNode;
  address?: ReactNode;
}

interface Classroom {
  id: string;
  name: string;
  capacity: number;
}

interface Course {
  id: string;
  name: string;
  level: string;
  teacher: string;
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
}

interface DataContextType {
  teachers: Teacher[];
  students: Student[];
  classrooms: Classroom[];
  courses: Course[];
  books: Book[];
  loans: Loan[];
  addTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  addStudent: (student: Omit<Student, 'id' | 'grades'>) => void;
  addClassroom: (classroom: Omit<Classroom, 'id'>) => void;
  addCourse: (course: Omit<Course, 'id'>) => void;
  updateGrade: (studentId: string, subject: string, grade: number) => void;
  fetchBooks: () => Promise<void>;
  fetchUserBooks: (userId: string) => Promise<Book[]>;
  addBook: (book: Omit<Book, 'id'>, userId: string) => Promise<void>;
  updateBook: (id: string, book: Partial<Book>) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  borrowBook: (bookId: string, userId: string, returnDate: string) => Promise<void>;
  returnBook: (loanId: string) => Promise<void>;
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
  const [books, setBooks] = useState<Book[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  
  useEffect(() => {
    const savedTeachers = localStorage.getItem('teachers');
    if (savedTeachers) setTeachers(JSON.parse(savedTeachers));
    
    const savedStudents = localStorage.getItem('students');
    if (savedStudents) setStudents(JSON.parse(savedStudents));
    
    const savedClassrooms = localStorage.getItem('classrooms');
    if (savedClassrooms) setClassrooms(JSON.parse(savedClassrooms));
    
    const savedCourses = localStorage.getItem('courses');
    if (savedCourses) setCourses(JSON.parse(savedCourses));
    
    if (!savedTeachers) {
      const initialTeachers = [
        { id: '1', name: 'Marie Dupont', email: 'marie@example.com', subject: 'Mathématiques', classroom: 'Salle 101' },
        { id: '2', name: 'Jean Martin', email: 'jean@example.com', subject: 'Français', classroom: 'Salle 102' }
      ];
      setTeachers(initialTeachers);
      localStorage.setItem('teachers', JSON.stringify(initialTeachers));
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('teachers', JSON.stringify(teachers));
  }, [teachers]);
  
  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);
  
  useEffect(() => {
    localStorage.setItem('classrooms', JSON.stringify(classrooms));
  }, [classrooms]);
  
  useEffect(() => {
    localStorage.setItem('courses', JSON.stringify(courses));
  }, [courses]);
  
  const addTeacher = (teacher: Omit<Teacher, 'id'>) => {
    const newTeacher = { ...teacher, id: Date.now().toString() };
    setTeachers([...teachers, newTeacher]);
  };
  
  const addStudent = (student: Omit<Student, 'id' | 'grades'>) => {
    const newStudent = { 
      ...student, 
      id: Date.now().toString(),
      grades: {} 
    };
    setStudents([...students, newStudent]);
  };
  
  const addClassroom = (classroom: Omit<Classroom, 'id'>) => {
    const newClassroom = { ...classroom, id: Date.now().toString() };
    setClassrooms([...classrooms, newClassroom]);
  };
  
  const addCourse = (course: Omit<Course, 'id'>) => {
    const newCourse = { ...course, id: Date.now().toString() };
    setCourses([...courses, newCourse]);
  };
  
  const updateGrade = (studentId: string, subject: string, grade: number) => {
    setStudents(students.map(student => {
      if (student.id === studentId) {
        return {
          ...student,
          grades: {
            ...student.grades,
            [subject]: grade
          }
        };
      }
      return student;
    }));
  };
  
  const fetchBooks = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get('http://localhost:8006/api/ressources/book/index', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

      setBooks(mappedBooks);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  }, []);

  const fetchUserBooks = useCallback(async (userId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`http://localhost:8006/api/usecases/user/getbooks/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('API response for user books:', response.data);

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
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const bookData = {
        title: book.title,
        author: book.author,
        publication_date: book.publication_date || null,
        genre: book.genre || null,
        status: book.available ? 'available' : 'borrowed',
        owner_id: userId,
      };

      const response = await axios.post('http://localhost:8006/api/ressources/book/store', bookData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const bookData = {
        title: book.title,
        author: book.author,
        publication_date: book.publication_date || null,
        genre: book.genre || null,
        status: book.available ? 'available' : 'borrowed',
      };

      const response = await axios.put(`http://localhost:8006/api/ressources/book/update/${id}`, bookData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      await axios.delete(`http://localhost:8006/api/ressources/book/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBooks(books.filter(book => book.id !== id));
    } catch (error) {
      console.error('Error deleting book:', error);
      throw error;
    }
  };

  const borrowBook = async (bookId: string, userId: string, returnDate: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Envoyer la demande d'emprunt
      await axios.post(`http://localhost:8006/api/usecases/notification/loanrequest/${bookId}/${userId}`, {
        return_date: returnDate
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Ne pas modifier l'état local, attendre que le backend mette à jour la disponibilité
    } catch (error) {
      console.error('Error requesting loan:', error);
      throw error;
    }
  };

  const returnBook = async (loanId: string) => {
    const loan = loans.find(l => l.id === loanId);
    if (!loan) return;
    
    setLoans(loans.map(l => {
      if (l.id === loanId) {
        return { ...l, returned: true };
      }
      return l;
    }));
    
    setBooks(books.map(book => {
      if (book.id === loan.bookId) {
        return { ...book, available: true };
      }
      return book;
    }));
  };

  const value = {
    teachers,
    students,
    classrooms,
    courses,
    books,
    loans,
    addTeacher,
    addStudent,
    addClassroom,
    addCourse,
    updateGrade,
    fetchBooks,
    fetchUserBooks,
    addBook,
    updateBook,
    deleteBook,
    borrowBook,
    returnBook
  };
  
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}