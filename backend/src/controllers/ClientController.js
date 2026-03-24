const ClientService = require('../services/ClientService');
const { sendResponse, sendError } = require('../utils/apiResponse');

class ClientController {
  static async createClient(req, res) {
    try {
      const { company_name, industry, contact_name, phone, email } = req.body;

      if (!company_name || !contact_name) {
        return sendError(res, 400, 'Company name and contact name are required');
      }

      const result = await ClientService.createClient(company_name, industry, contact_name, phone, email);
      return sendResponse(res, 201, result, 'Client created successfully');
    } catch (error) {
      return sendError(res, 500, error.message);
    }
  }

  static async getClient(req, res) {
    try {
      const { id } = req.params;
      const client = await ClientService.getClientById(id);
      return sendResponse(res, 200, client, 'Client retrieved successfully');
    } catch (error) {
      return sendError(res, 404, error.message);
    }
  }

  static async getAllClients(req, res) {
    try {
      const clients = await ClientService.getAllClients();
      return sendResponse(res, 200, clients, 'Clients retrieved successfully');
    } catch (error) {
      return sendError(res, 500, error.message);
    }
  }

  static async searchClients(req, res) {
    try {
      const { q } = req.query;
      const clients = await ClientService.searchClients(q || '');
      return sendResponse(res, 200, clients, 'Search results retrieved');
    } catch (error) {
      return sendError(res, 500, error.message);
    }
  }

  static async updateClient(req, res) {
    try {
      const { id } = req.params;
      const { company_name, industry, contact_name, phone, email } = req.body;

      if (!company_name || !contact_name) {
        return sendError(res, 400, 'Company name and contact name are required');
      }

      const result = await ClientService.updateClient(id, company_name, industry, contact_name, phone, email);
      return sendResponse(res, 200, result, 'Client updated successfully');
    } catch (error) {
      return sendError(res, error.message === 'Client not found' ? 404 : 500, error.message);
    }
  }

  static async deleteClient(req, res) {
    try {
      const { id } = req.params;
      await ClientService.deleteClient(id);
      return sendResponse(res, 200, null, 'Client deleted successfully');
    } catch (error) {
      return sendError(res, error.message === 'Client not found' ? 404 : 500, error.message);
    }
  }
}

module.exports = ClientController;
