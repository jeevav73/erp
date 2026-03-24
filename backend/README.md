# Backend - Digital Agency ERP System

Express.js backend API for the Digital Agency ERP System with SQLite database, JWT authentication, and Clean Architecture.

## Quick Start

### Installation
```bash
npm install
```

### Configuration
```bash
cp .env.example .env
```

Update `.env` with your values:
- `JWT_SECRET`: Unique secret key for JWT signing
- `OPENAI_API_KEY`: Your OpenAI API key for AI features
- `DATABASE_PATH`: Path to SQLite database file

### Initialize Database
```bash
npm run init-db
```

This creates all tables and seeds a default admin user.

### Start Server
```bash
# Development
npm run dev

# Production
npm start
```

Server runs on `http://localhost:5000`

## Project Structure

```
src/
├── controllers/        # HTTP request handlers
├── models/            # Database query functions
├── services/          # Business logic layer
├── middleware/        # Auth, RBAC, error handling
├── routes/            # API route definitions
├── database/          # Connection and initialization
├── utils/             # Helper functions
├── app.js             # Express application setup
└── server.js          # Server entry point
```

## Clean Architecture Pattern

Each module follows:
1. **Controller**: Handles HTTP requests/responses
2. **Service**: Contains business logic
3. **Model**: Database operations
4. **Middleware**: Cross-cutting concerns (auth, validation)

```
Request → Route → Middleware → Controller → Service → Model → Database
Response ← Route ← Controller ← Service ← Model ← Database
```

## API Response Format

All responses follow a standard format:

```javascript
{
  statusCode: 200,           // HTTP status code
  data: {...},              // Response data
  message: "Success",       // Human-readable message
  success: true            // Boolean success indicator
}
```

## Authentication

### JWT Flow
1. User logs in with email/password
2. Backend validates credentials and generates JWT
3. Client stores JWT in localStorage
4. Client includes JWT in Authorization header for protected routes

### RBAC Middleware
```javascript
// Usage in routes
router.delete('/:id', authMiddleware, checkRole(['Admin']), controller.delete);
```

## Database

SQLite database with 5 main tables:
- **users**: User accounts and roles
- **clients**: Business clients
- **projects**: Client projects
- **tasks**: Project tasks
- **ai_content**: Generated AI content

Foreign keys ensure referential integrity.

## Error Handling

- Standardized error responses with status codes
- Proper HTTP status codes (400, 401, 403, 404, 500)
- Try-catch blocks in controllers
- Validation in services

## Middleware Stack

```javascript
app.use(express.json());              // Body parser
app.use(express.urlencoded());        // URL encoded parser
app.use(cors());                      // CORS
app.use(authMiddleware);              // JWT validation
app.use(errorHandler);                // Error handling
```

## Security Features

1. **Password Hashing**: bcryptjs with 10 salt rounds
2. **JWT Tokens**: Secure token generation
3. **RBAC**: Role-based access control
4. **Input Validation**: Type checking and validation
5. **CORS**: Cross-origin resource sharing

## Environment Variables

```
# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_PATH=./src/database/erp.db

# JWT
JWT_SECRET=your_secret_key_here
JWT_EXPIRY=7d

# OpenAI
OPENAI_API_KEY=sk-...
```

## Development

### Scripts
```bash
npm start      # Run production server
npm run dev    # Run with nodemon
npm run init-db # Initialize database
```

### Common Tasks

**Add new endpoint:**
1. Create model method (src/models/)
2. Create service method (src/services/)
3. Create controller method (src/controllers/)
4. Add route (src/routes/)

**Example:**
```javascript
// Model (models/UserModel.js)
static async findByRole(role) {
  return allQuery('SELECT * FROM users WHERE role = ?', [role]);
}

// Service (services/UserService.js)
static async getUsersByRole(role) {
  return UserModel.findByRole(role);
}

// Controller (controllers/UserController.js)
static async getUsersByRole(req, res) {
  const users = await UserService.getUsersByRole(req.params.role);
  return sendResponse(res, 200, users, 'Users retrieved');
}

// Route (routes/userRoutes.js)
router.get('/role/:role', authMiddleware, UserController.getUsersByRole);
```

## Testing API

### Using curl
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"pass123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@erp.com","password":"password123"}'

# Authenticated request
curl http://localhost:5000/api/clients \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman
1. Get JWT token from `/api/auth/login`
2. Set Authorization header: `Bearer {token}`
3. Test endpoints

## Troubleshooting

**Database Lock Error**
- Close other database connections
- Delete .db-shm and .db-wal files
- Restart server

**JWT Expired**
- User needs to log in again
- Check JWT_EXPIRY setting

**CORS Error**
- Update FRONTEND_URL in .env
- Restart server

**OpenAI Rate Limit**
- Wait before making new requests
- Check API quota in OpenAI dashboard

## Performance Tips

1. Use database indexes on frequently queried columns
2. Implement pagination for large result sets
3. Cache frequently accessed data
4. Use connection pooling for high traffic
5. Monitor query performance with logs

## Next Steps

- [ ] Add input validation middleware
- [ ] Implement logging system
- [ ] Add rate limiting
- [ ] Create unit tests
- [ ] Add API documentation (Swagger)
- [ ] Implement caching layer
- [ ] Add database migrations

---

For full API documentation, see [parent README.md](../README.md)
