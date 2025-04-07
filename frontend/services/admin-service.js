import { fetchDataFromApi, saveDataToApi } from './api-service.js';

async function createAdmin(data) {
  const admins = await fetchAllAdmins();
  const maxId = admins.reduce((max, admin) => Math.max(max, admin.id), 0);
  
  const newAdmin = {
    id: maxId + 1,
    name: data.name,
  };
  
  return await saveDataToApi('/admins', newAdmin);
}

async function updateAdmin(adminData) {
  if (!adminData.id) {
    throw new Error('Admin ID is required for updating');
  }
  
  return await saveDataToApi(`/admins/${adminData.id}`, adminData, 'PUT');
}

async function fetchAllAdmins() {
  const response = await fetchDataFromApi('/admins');
  return response || [];
}

async function fetchAdminById(adminId) {
  const response = await fetchDataFromApi(`/admins/${adminId}`);
  return response || null;
}

export { 
  createAdmin,
  updateAdmin,
  fetchAllAdmins, 
  fetchAdminById 
}; 