import { fetchDataFromApi, saveDataToApi } from './api-service.js';

async function createUser(data = {}) {
  const validUserTypes = ['Admin', 'Instructor', 'Student'];
  if (!data.userType || !validUserTypes.includes(data.userType)) {
    throw new Error('UserType must be either Admin, Instructor or Student');
  }
  
  const users = await fetchAllUsers();
  const maxId = users.reduce((max, user) => Math.max(max, user.id), 0);
  
  const newUser = {
    id: data.id || maxId + 1,
    email: data.email,
    password: data.password,
    userType: data.userType
  };
  
  return await saveDataToApi('/users', newUser);
}

async function updateUser(data) {
  const validUserTypes = ['Admin', 'Instructor', 'Student'];
  if (!data.userType || !validUserTypes.includes(data.userType)) {
    throw new Error('UserType must be either Admin, Instructor or Student');
  }
  
  const updatedUser = {
    id: data.id,
    email: data.email,
    password: data.password,
    userType: data.userType
  };
  
  return await saveDataToApi(`/users/${data.id}`, updatedUser);
}

async function fetchAllUsers() {
  const response = await fetchDataFromApi('/users');
  return response || [];
}

// Fetch a specific user by ID
async function fetchUserById(userId) {
  const response = await fetchDataFromApi(`/users/${userId}`);
  return response || null;
}

export { createUser, updateUser, fetchAllUsers, fetchUserById }; 