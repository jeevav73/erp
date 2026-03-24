const ClientModel = require('../models/ClientModel');

class ClientService {
  static async createClient(companyName, industry, contactName, phone, email) {
    if (!companyName || !contactName) {
      throw new Error('Company name and contact name are required');
    }
    return ClientModel.create(companyName, industry, contactName, phone, email);
  }

  static async getClientById(id) {
    const client = await ClientModel.findById(id);
    if (!client) {
      throw new Error('Client not found');
    }
    return client;
  }

  static async getAllClients() {
    return ClientModel.findAll();
  }

  static async searchClients(searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') {
      return this.getAllClients();
    }
    return ClientModel.search(searchTerm);
  }

  static async updateClient(id, companyName, industry, contactName, phone, email) {
    const existingClient = await this.getClientById(id);
    if (!existingClient) {
      throw new Error('Client not found');
    }

    return ClientModel.update(id, companyName, industry, contactName, phone, email);
  }

  static async deleteClient(id) {
    await this.getClientById(id);
    return ClientModel.delete(id);
  }
}

module.exports = ClientService;
