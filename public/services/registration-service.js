class RegistrationService {
  constructor() {
    this.baseUrl = '/api/registrations';
  }

  async getAllRegistrations() {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to fetch registrations');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching registrations:', error);
      throw error;
    }
  }

  async getRegistrationById(id) {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to fetch registration');
      }
      return response.json();
    } catch (error) {
      console.error(`Error fetching registration ${id}:`, error);
      throw error;
    }
  }

  async createRegistration(registrationData) {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to create registration');
      }
      return response.json();
    } catch (error) {
      console.error('Error creating registration:', error);
      throw error;
    }
  }

  async updateRegistration(id, registrationData) {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to update registration');
      }
      return response.json();
    } catch (error) {
      console.error(`Error updating registration ${id}:`, error);
      throw error;
    }
  }

  async deleteRegistration(id) {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to delete registration');
      }
      return response.json();
    } catch (error) {
      console.error(`Error deleting registration ${id}:`, error);
      throw error;
    }
  }

  async getRegistrationsByStudent(studentId) {
    try {
      const response = await fetch(`${this.baseUrl}?studentId=${studentId}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to fetch registrations for student');
      }
      return response.json();
    } catch (error) {
      console.error(`Error fetching registrations for student ${studentId}:`, error);
      throw error;
    }
  }
}

export default new RegistrationService();
