const ContentProductionService = require('../services/ContentProductionService');

class ContentProductionController {
  static async create(req, res, next) {
    try {
      const payload = { ...req.body, created_by: req.user?.id };
      const result = await ContentProductionService.create(payload);
      res.json({ statusCode: 200, data: result, message: 'Created', success: true });
    } catch (err) {
      next(err);
    }
  }

  static async list(req, res, next) {
    try {
      const rows = await ContentProductionService.list();
      res.json({ statusCode: 200, data: rows, message: 'OK', success: true });
    } catch (err) {
      next(err);
    }
  }

  static async getById(req, res, next) {
    try {
      const row = await ContentProductionService.getById(req.params.id);
      res.json({ statusCode: 200, data: row, message: 'OK', success: true });
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    try {
      const result = await ContentProductionService.update(req.params.id, req.body);
      res.json({ statusCode: 200, data: result, message: 'Updated', success: true });
    } catch (err) {
      next(err);
    }
  }

  static async remove(req, res, next) {
    try {
      const result = await ContentProductionService.remove(req.params.id);
      res.json({ statusCode: 200, data: result, message: 'Deleted', success: true });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ContentProductionController;
