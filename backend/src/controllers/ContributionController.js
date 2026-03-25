const ContributionService = require('../services/ContributionService');

class ContributionController {
  static async create(req, res, next) {
    try {
      const payload = { ...req.body, created_by: req.user?.id };
      const result = await ContributionService.createContribution(payload);
      res.json({ statusCode: 200, data: result, message: 'Created', success: true });
    } catch (error) {
      next(error);
    }
  }

  static async list(req, res, next) {
    try {
      const rows = await ContributionService.getAllContributions();
      res.json({ statusCode: 200, data: rows, message: 'OK', success: true });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const id = req.params.id;
      const row = await ContributionService.getContributionById(id);
      res.json({ statusCode: 200, data: row, message: 'OK', success: true });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const id = req.params.id;
      const payload = req.body;
      const result = await ContributionService.updateContribution(id, payload);
      res.json({ statusCode: 200, data: result, message: 'Updated', success: true });
    } catch (error) {
      next(error);
    }
  }

  static async remove(req, res, next) {
    try {
      const id = req.params.id;
      const result = await ContributionService.deleteContribution(id);
      res.json({ statusCode: 200, data: result, message: 'Deleted', success: true });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ContributionController;
