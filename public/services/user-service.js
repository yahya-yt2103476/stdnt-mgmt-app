class UserService {
  constructor() {
    this.baseUrl = '/api/users';
  }

  async getAllUsers() {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details + 'Failed to fetch users 0_0');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching users 0_0:', error);
      throw error;
    }
  }

  async getUserById(id) {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details + 'Failed to fetch user 0_0');
      }
      return response.json();
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw error;
    }
  }

  async createUser(userData) {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details + 'Failed to create user 0_0');
      }
      return response.json();
    } catch (error) {
      console.error('Error creating user 0_0:', error);
      throw error;
    }
  }

  async updateUser(id, userData) {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details + 'Failed to update user 0_0');
      }
      return response.json();
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw error;
    }
  }

  async deleteUser(id) {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to delete user');
      }
      return response.json();
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      throw error;
    }
  }
}

export default new UserService();
