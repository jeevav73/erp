const AuthService = require('../services/AuthService');
const { sendResponse, sendError } = require('../utils/apiResponse');

class AuthController {
  static async register(req, res) {
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password) {
        return sendError(res, 400, 'Name, email, and password are required');
      }

      await AuthService.register(name, email, password, role || 'Employee');
      return sendResponse(res, 201, null, 'User registered successfully');
    } catch (error) {
      return sendError(res, 400, error.message);
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return sendError(res, 400, 'Email and password are required');
      }

      const result = await AuthService.login(email, password);
      return sendResponse(res, 200, result, 'Login successful');
    } catch (error) {
      return sendError(res, 401, error.message);
    }
  }

  static async verifyToken(req, res) {
    try {
      const user = req.user;
      return sendResponse(res, 200, user, 'Token is valid');
    } catch (error) {
      return sendError(res, 401, error.message);
    }
  }
}

module.exports = AuthController;
