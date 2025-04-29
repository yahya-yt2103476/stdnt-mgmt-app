class AdminService {
  constructor() {
    this.baseUrl = '/api/admins';
  }

  async getAllAdmins() {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to fetch admins');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching admins:', error);
      throw error;
    }
  }

  async getAdminById(id) {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to fetch admin');
      }
      return response.json();
    } catch (error) {
      console.error(`Error fetching admin ${id}:`, error);
      throw error;
    }
  }

  async createAdmin(adminData) {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adminData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to create admin');
      }
      return response.json();
    } catch (error) {
      console.error('Error creating admin:', error);
      throw error;
    }
  }

  async updateAdmin(id, adminData) {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adminData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to update admin');
      }
      return response.json();
    } catch (error) {
      console.error(`Error updating admin ${id}:`, error);
      throw error;
    }
  }

  async deleteAdmin(id) {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to delete admin');
      }
      return response.json();
    } catch (error) {
      console.error(`Error deleting admin ${id}:`, error);
      throw error;
    }
  }
}

export default new AdminService();
