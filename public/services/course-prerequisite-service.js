class CoursePrerequisiteService {
  constructor() {
    this.baseUrl = '/api/courses/prerequisites';
  }

  async getAllPrerequisites() {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to fetch course prerequisites');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching course prerequisites:', error);
      throw error;
    }
  }

  async getPrerequisiteById(id) {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to fetch course prerequisite');
      }
      return response.json();
    } catch (error) {
      console.error(`Error fetching course prerequisite ${id}:`, error);
      throw error;
    }
  }

  async createPrerequisite(prerequisiteData) {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(prerequisiteData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to create course prerequisite');
      }
      return response.json();
    } catch (error) {
      console.error('Error creating course prerequisite:', error);
      throw error;
    }
  }

  async updatePrerequisite(id, prerequisiteData) {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(prerequisiteData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to update course prerequisite');
      }
      return response.json();
    } catch (error) {
      console.error(`Error updating course prerequisite ${id}:`, error);
      throw error;
    }
  }

  async deletePrerequisite(id) {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to delete course prerequisite');
      }
      return response.json();
    } catch (error) {
      console.error(`Error deleting course prerequisite ${id}:`, error);
      throw error;
    }
  }
}

export default new CoursePrerequisiteService();
