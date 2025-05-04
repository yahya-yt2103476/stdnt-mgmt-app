class SectionService {
  constructor() {
    this.baseUrl = '/api/sections';
  }

  async getAllSections() {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details + 'Failed to fetch sctions 0_0');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching sections 0_0:', error);
      throw error;
    }
  }

  async getSectionById(id) {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details + 'Failed to fetch section 0_0');
      }
      return response.json();
    } catch (error) {
      console.error(`Error fetching section ${id}:`, error);
      throw error;
    }
  }

  async createSection(sectionData) {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sectionData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details + 'Failed to create section 0_0');
      }
      return response.json();
    } catch (error) {
      console.error('Error creating section 0_0:', error);
      throw error;
    }
  }

  async updateSection(id, sectionData) {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sectionData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details + 'Failed to update section 0_0');
      }
      return response.json();
    } catch (error) {
      console.error(`Error updating section ${id}:`, error);
      throw error;
    }
  }

  async deleteSection(id) {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details + 'Failed to delete section 0_0');
      }
      return response.json();
    } catch (error) {
      console.error(`Error deleting section ${id}:`, error);
      throw error;
    }
  }

  async getSectionsByCourse(courseId) {
    try {
      const response = await fetch(`${this.baseUrl}?courseId=${courseId}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details + 'Failed to ftch sections for course 0_0');
      }
      return response.json();
    } catch (error) {
      console.error(`Error fetching sections for course ${courseId}:`, error);
      throw error;
    }
  }

  async getSectionsBySemester(semester) {
    try {
      const response = await fetch(`${this.baseUrl}?semester=${semester}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details + 'Failed to fetch sections for semester 0_0');
      }
      return response.json();
    } catch (error) {
      console.error(`Error fetching sections for semester ${semester}:`, error);
      throw error;
    }
  }

  async getSectionsByInstructor(instructorId) {
    try {
      const response = await fetch(`${this.baseUrl}?instructorId=${instructorId}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details + 'Failed to fetch sections for instructor 0_0');
      }
      return response.json();
    } catch (error) {
      console.error(`Error fetching sections for instructor ${instructorId}:`, error);
      throw error;
    }
  }

  async getSectionsByCourseAndSemester(courseId, semester) {
    try {
      const response = await fetch(`${this.baseUrl}?courseId=${courseId}&semester=${semester}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details + 'Failed to fetch sections for course and semester 0_0');
      }
      return response.json();
    } catch (error) {
      console.error(`Error fetching sections for course ${courseId} and semester ${semester}:`, error);
      throw error;
    }
  }

  async getSectionsByStatus(status) {
    try {
      const response = await fetch(`${this.baseUrl}?status=${status}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details + 'Failed to fetch sections by status 0_0');
      }
      return response.json();
    } catch (error) {
      console.error(`Error fetching sections by status ${status}:`, error);
      throw error;
    }
  }

  async getSectionsStatusDistribution() {
    try {
      const response = await fetch(`${this.baseUrl}/status-distribution`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch section status distribution');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching section status distribution:', error);
      throw error;
    }
  }
}

export default new SectionService();
