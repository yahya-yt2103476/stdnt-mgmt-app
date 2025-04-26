import { fetchDataFromApi, saveDataToApi, deleteDataFromApi } from './api-service.js';



async function createAndSaveRegistration(data = {}) {
  
  const validStatuses = ['pending', 'approved', 'cancelled'];
  
  if (data.status && !validStatuses.includes(data.status)) {
    throw new Error('Registration status must be one of: pending, approved, cancelled');
  }
  
  const registrations = await fetchAllRegistrations();
  const maxId = registrations.reduce((max, registration) => Math.max(max, registration.id), 0);
  
  const newRegistration = {
    id: data.id || maxId + 1,
    studentId: data.studentId,
    sectionId: data.sectionId,
    grade: data.grade || '',
    status: data.status || 'pending'
  };
  
  return await saveDataToApi('/registration', newRegistration);
}

async function fetchAllRegistrations() {
  const response = await fetchDataFromApi('/registration');
  return response || [];
}

async function fetchRegistrationById(registrationId) {
  const response = await fetchDataFromApi(`/registration/${registrationId}`);
  return response || null;
}

async function updateRegistrationData(registrationData) {
  return await saveDataToApi('/registration', registrationData, "PUT");
}

async function deleteRegistrationById(registrationId) {
  return await deleteDataFromApi(`/registration/${registrationId}`);
}

export { 
  createAndSaveRegistration, 
  fetchAllRegistrations, 
  fetchRegistrationById, 
  updateRegistrationData,
  deleteRegistrationById 
}; 