import { fetchDataFromApi, saveDataToApi } from "./api-service.js";

async function createAdmin(data) {
  

  const newAdmin = {
    id: maxId + 1,
    name: data.name,
  };

  return await saveDataToApi("/admins", newAdmin);
}

async function updateAdmin(adminData, method) {
  !method && (method = "POST"); // Default to POST if method is not provided
  const admins = await fetchAllAdmins();
  const maxId = admins.reduce((max, admin) => Math.max(max, admin.id), 0);
  const newAdmin = {
    id: adminData.id,
    ...adminData
  };

  return await saveDataToApi(`/admins`, newAdmin, method);
}

async function fetchAllAdmins() {
  const response = await fetchDataFromApi("/admins");
  return response || [];
}

async function fetchAdminById(adminId) {
  const response = await fetchDataFromApi(`/admins/${adminId}`);
  return response || null;
}

export { createAdmin, updateAdmin, fetchAllAdmins, fetchAdminById };
