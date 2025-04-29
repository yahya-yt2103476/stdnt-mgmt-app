class CompletedCourseService {
  constructor() {
    this.baseUrl = '/api/courses/completed';
  }

  async getAllCompletedCourses() {
    try {
      const response = await fetch(this.baseUrl);
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Expected JSON but got: ${text.substring(0, 100)}...`);
      }
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to fetch completed courses');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error fetching completed courses:', error);
      throw error;
    }
  }

  async getCompletedCourseById(id) {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Expected JSON but got: ${text.substring(0, 100)}...`);
      }
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to fetch completed course');
      }
      
      return response.json();
    } catch (error) {
      console.error(`Error fetching completed course ${id}:`, error);
      throw error;
    }
  }

  async createCompletedCourse(completedCourseData) {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(completedCourseData),
      });
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Expected JSON but got: ${text.substring(0, 100)}...`);
      }
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to create completed course');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error creating completed course:', error);
      throw error;
    }
  }

  async updateCompletedCourse(id, completedCourseData) {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(completedCourseData),
      });
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Expected JSON but got: ${text.substring(0, 100)}...`);
      }
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to update completed course');
      }
      
      return response.json();
    } catch (error) {
      console.error(`Error updating completed course ${id}:`, error);
      throw error;
    }
  }

  async deleteCompletedCourse(id) {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      });
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Expected JSON but got: ${text.substring(0, 100)}...`);
      }
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to delete completed course');
      }
      
      return response.json();
    } catch (error) {
      console.error(`Error deleting completed course ${id}:`, error);
      throw error;
    }
  }
}

export default new CompletedCourseService();
