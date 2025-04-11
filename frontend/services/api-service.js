const API_BASE_URL = 'http://localhost:3001/api';

async function fetchDataFromApi(endpoint) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching data: ${error}`);
    return null;
  }
}

async function saveDataToApi(endpoint, data, method) {
  method = method || 'POST'; // Default to POST if no method is provided
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Error posting data: ${error}`);
    return null;
  }
}

async function deleteDataFromApi(endpoint) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Error deleting data: ${error}`);
    return null;
  }
}

export { fetchDataFromApi, saveDataToApi, deleteDataFromApi }; 