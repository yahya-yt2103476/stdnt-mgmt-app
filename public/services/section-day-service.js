class SectionDayService {
  constructor() {
    this.baseUrl = '/api/sections/days';
  }

  async getAllSectionDays() {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to fetch section days');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching section days:', error);
      throw error;
    }
  }

  async getSectionDayById(id) {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to fetch section day');
      }
      return response.json();
    } catch (error) {
      console.error(`Error fetching section day ${id}:`, error);
      throw error;
    }
  }

  async createSectionDay(sectionDayData) {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sectionDayData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to create section day');
      }
      return response.json();
    } catch (error) {
      console.error('Error creating section day:', error);
      throw error;
    }
  }

  async updateSectionDay(id, sectionDayData) {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sectionDayData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to update section day');
      }
      return response.json();
    } catch (error) {
      console.error(`Error updating section day ${id}:`, error);
      throw error;
    }
  }

  async deleteSectionDay(id) {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to delete section day');
      }
      return response.json();
    } catch (error) {
      console.error(`Error deleting section day ${id}:`, error);
      throw error;
    }
  }
}

export default new SectionDayService();
