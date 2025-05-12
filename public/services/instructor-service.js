class InstructorService {
  constructor() {
    this.baseUrl = '/api/instructors';
  }

  async getAllInstructors() {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details + 'Failed to fetch instructors 0_0');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching instructors:', error);
      throw error;
    }
  }

  async getInstructorById(id) {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details + 'Failed to fetch instructor 0_0');
      }
      return response.json();
    } catch (error) {
      console.error(`Error fetching instructor ${id}:`, error);
      throw error;
    }
  }

  async getInstructorByUserId(userId) {
    try {
      // Calls the new endpoint: /api/instructors/user/{userId}
      const response = await fetch(`${this.baseUrl}/user/${userId}`);
      if (!response.ok) {
         if (response.status === 404) {
           console.log(`No instructor found for user ID: ${userId}`);
           return null; // Or throw a specific "NotFound" error
        }
        const error = await response.json();
        throw new Error(error.details || `Failed to fetch instructor for user ID ${userId} 0_0`);
      }
      return response.json();
    } catch (error) {
      console.error(`Error fetching instructor by user ID ${userId}:`, error);
      throw error;
    }
  }

  async createInstructor(instructorData) {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(instructorData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details + 'Failed to create instructor 0_0');
      }
      return response.json();
    } catch (error) {
      console.error('Error creating instructor:', error);
      throw error;
    }
  }

  async updateInstructor(id, instructorData) {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(instructorData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details + 'Failed to update instructor 0_0');
      }
      return response.json();
    } catch (error) {
      console.error(`Error updating instructor ${id}:`, error);
      throw error;
    }
  }

  async deleteInstructor(id) {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details + 'Failed to delete instructor 0_0');
      }
      return response.json();
    } catch (error) {
      console.error(`Error deleting instructor ${id}:`, error);
      throw error;
    }
  }

  async getTotalInstructors() {
    try {
      const response = await fetch(`${this.baseUrl}/total-count`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch total instructors');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching total instructors:', error);
      throw error;
    }
  }
}

export default new InstructorService();
