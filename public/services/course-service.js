class CourseService {
  constructor() {
    this.baseUrl = '/api/courses';
  }

  async getAllCourses() {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to fetch courses');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  }

  async getCourseById(id) {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to fetch course');
      }
      return response.json();
    } catch (error) {
      console.error(`Error fetching course ${id}:`, error);
      throw error;
    }
  }

  async getCoursesByCategory(category) {
    try {
      const response = await fetch(`${this.baseUrl}?category=${category}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to fetch courses by category');
      }
      return response.json();
    } catch (error) {
      console.error(`Error fetching courses by category ${category}:`, error);
      throw error;
    }
  }

  async getCourseByShortName(shortName) {
    try {
      const response = await fetch(`${this.baseUrl}?shortName=${shortName}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to fetch course by short name');
      }
      return response.json();
    } catch (error) {
      console.error(`Error fetching course by short name ${shortName}:`, error);
      throw error;
    }
  }

  async createCourse(courseData) {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to create course');
      }
      return response.json();
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  }

  async updateCourse(id, courseData) {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to update course');
      }
      return response.json();
    } catch (error) {
      console.error(`Error updating course ${id}:`, error);
      throw error;
    }
  }

  async deleteCourse(id) {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to delete course');
      }
      return response.json();
    } catch (error) {
      console.error(`Error deleting course ${id}:`, error);
      throw error;
    }
  }
}

export default new CourseService();
