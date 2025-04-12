import { fetchDataFromApi, saveDataToApi, deleteDataFromApi } from './api-service.js';

async function createInstructor(data) {
  return await saveDataToApi('/instructors', newInstructor);
}

async function updateInstructor(instructor, method) {
  !method && (method = "POST"); // 
  const instructors = await fetchAllInstructors();
  const maxId = instructors.reduce((max, instructor) => Math.max(max, instructor.id), 0);
  
  const newInstructor = {
    id: maxId + 1,
    ...instructor
  };
  return await saveDataToApi(`/instructors`, newInstructor, method);
}

async function fetchAllInstructors() {
  const response = await fetchDataFromApi('/instructors');
  return response || [];
}

async function fetchInstructorById(instructorId) {
  const response = await fetchDataFromApi(`/instructors/${parseInt(instructorId)}`);
  return response ;
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