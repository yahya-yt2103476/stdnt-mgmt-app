class StudentService {
  constructor() {
    this.baseUrl = '/api/students';
  }

  async getAllStudents() {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details + 'Failed to fetch students 0_0');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching students 0_0:', error);
      throw error;
    }
  }

  async getStudentById(id) {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details + 'Failed to fetch student 0_0');
      }
      return response.json();
    } catch (error) {
      console.error(`Error fetching student ${id}:`, error);
      throw error;
    }
  }

  async createStudent(studentData) {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details + 'Failed to create student 0-0');
      }
      return response.json();
    } catch (error) {
      console.error('Error creating student 0_0:', error);
      throw error;
    }
  }

  async updateStudent(id, studentData) {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details + 'Failed to update student 0.0');
      }
      return response.json();
    } catch (error) {
      console.error(`Error updating student ${id}:`, error);
      throw error;
    }
  }

  async deleteStudent(id) {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details + 'Failed to delete student 0.0');
      }
      return response.json();
    } catch (error) {
      console.error(`Error deleting student ${id}:`, error);
      throw error;
    }
  }
}

export default new StudentService();
