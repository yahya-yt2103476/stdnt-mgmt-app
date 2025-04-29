class PublishedCoursesService {
  constructor() {
    this.baseUrl = '/api/courses/published';
  }

  async getAllPublishedCourses() {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to fetch published courses');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching published courses:', error);
      throw error;
    }
  }

  async getPublishedCourseById(id) {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to fetch published course');
      }
      return response.json();
    } catch (error) {
      console.error(`Error fetching published course ${id}:`, error);
      throw error;
    }
  }

  async getPublishedCoursesBySemester(semester) {
    try {
      const response = await fetch(`${this.baseUrl}?semester=${semester}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to fetch published courses for semester');
      }
      return response.json();
    } catch (error) {
      console.error(`Error fetching published courses for semester ${semester}:`, error);
      throw error;
    }
  }

  async createPublishedCourse(publishedCourseData) {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(publishedCourseData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to create published course');
      }
      return response.json();
    } catch (error) {
      console.error('Error creating published course:', error);
      throw error;
    }
  }

  async updatePublishedCourse(id, publishedCourseData) {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(publishedCourseData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to update published course');
      }
      return response.json();
    } catch (error) {
      console.error(`Error updating published course ${id}:`, error);
      throw error;
    }
  }

  async deletePublishedCourse(id) {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to delete published course');
      }
      return response.json();
    } catch (error) {
      console.error(`Error deleting published course ${id}:`, error);
      throw error;
    }
  }
}

export default new PublishedCoursesService();
