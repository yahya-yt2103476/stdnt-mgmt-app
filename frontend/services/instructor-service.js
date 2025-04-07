import { fetchDataFromApi, saveDataToApi, deleteDataFromApi } from './api-service.js';

async function createInstructor(data) {
  const instructors = await fetchAllInstructors();
  const maxId = instructors.reduce((max, instructor) => Math.max(max, instructor.id), 0);
  
  const newInstructor = {
    id: maxId + 1,
    name: data.name,
  };
  
  return await saveDataToApi('/instructors', newInstructor);
}

async function updateInstructor(instructor) {
  return await saveDataToApi(`/instructors/${instructor.id}`, instructor);
}

async function fetchAllInstructors() {
  const response = await fetchDataFromApi('/instructors');
  return response || [];
}

async function fetchInstructorById(instructorId) {
  const response = await fetchDataFromApi(`/instructors/${instructorId}`);
  return response || null;
}

async function deleteInstructorById(instructorId) {
  return await deleteDataFromApi(`/instructors/${instructorId}`);
}

export { 
  createInstructor,
  updateInstructor,
  fetchAllInstructors, 
  fetchInstructorById, 
  deleteInstructorById 
}; 