/**
 * FAB STEEL CONSULTANCY ERP - BASE REPOSITORY
 * Generic repository abstraction for entity persistence and retrieval via FabApiClient
 */

(function () {
  'use strict';

  class BaseRepository {
    /**
     * @param {string} resourceName - Endpoint path (e.g. 'employees', 'invoices')
     */
    constructor(resourceName) {
      this.resource = resourceName;
      this.client = window.FabApiClient;
    }

    /**
     * Fetch all records with optional query parameters
     */
    async getAll(params = null) {
      const response = await this.client.get(`/${this.resource}`, params);
      return response;
    }

    /**
     * Fetch single record by ID
     */
    async getById(id) {
      if (!id) throw new Error('ID is required to get record');
      const response = await this.client.get(`/${this.resource}/${id}`);
      return response;
    }

    /**
     * Create a new record
     */
    async create(data) {
      const response = await this.client.post(`/${this.resource}`, data);
      return response;
    }

    /**
     * Update an existing record
     */
    async update(id, data) {
      if (!id) throw new Error('ID is required to update record');
      const response = await this.client.put(`/${this.resource}/${id}`, data);
      return response;
    }

    /**
     * Partially update an existing record
     */
    async patch(id, data) {
      if (!id) throw new Error('ID is required to patch record');
      const response = await this.client.patch(`/${this.resource}/${id}`, data);
      return response;
    }

    /**
     * Delete a record by ID
     */
    async delete(id) {
      if (!id) throw new Error('ID is required to delete record');
      const response = await this.client.delete(`/${this.resource}/${id}`);
      return response;
    }
  }

  window.FabBaseRepository = BaseRepository;
})();

