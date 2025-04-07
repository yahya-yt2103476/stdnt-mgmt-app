import { fetchDataFromApi, saveDataToApi } from './api-service.js';

async function createAndSaveAdmin(data) {
  const admins = await fetchAllAdmins();
  const maxId = admins.reduce((max, admin) => Math.max(max, admin.id), 0);
  
  const newAdmin = {
    id: maxId + 1,
    name: data.name,
  };
  
  return await saveDataToApi('/admins', newAdmin);
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
  createAndSaveAdmin, 
  fetchAllAdmins, 
  fetchAdminById 
}; 