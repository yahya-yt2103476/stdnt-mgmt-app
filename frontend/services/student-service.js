import { fetchDataFromApi, saveDataToApi, deleteDataFromApi } from './api-service.js';

async function createStudent(data) {
  if (data.major && !["Computer Science","Computer Engineering"].includes(data.major)) {
    throw new Error('Major should be either Computer Engineering or Computer Science');
  }
  const newStudent = {
    id: data.id,
    name: data.name,
    completedCourses: data.completedCourses || [],
    registeredCourses: data.registeredCourses || [],
    gpa: data.gpa || 0,
    major: data.major
  };
  
  return await saveDataToApi('/students', newStudent);
}

async function updateStudent(data) {
  if (data.major && !["Computer Science","Computer Engineering"].includes(data.major)) {
    throw new Error('Major should be either Computer Engineering or Computer Science');
  }
  const updatedStudent = {
    id: data.id,
    name: data.name,
    completedCourses: data.completedCourses || [],
    registeredCourses: data.registeredCourses || [],
    gpa: data.gpa || 0,
    major: data.major
  };
  
  return await saveDataToApi(`/students/${data.id}`, updatedStudent);
}

async function fetchAllStudents() {
  const response = await fetchDataFromApi('/students');
  return response || [];
}

async function fetchStudentById(studentId) {
  const response = await fetchDataFromApi(`/students/${studentId}`);
  return response || null;
}

async function deleteStudentById(studentId) {
  return await deleteDataFromApi(`/students/${studentId}`);
}

export { 
  createStudent,
  updateStudent,
  fetchAllStudents, 
  fetchStudentById, 
  deleteStudentById 
}; 