# Digital Agency ERP System

A scalable, enterprise-grade ERP application built with **React.js**, **Node.js/Express**, and **SQLite**. Designed to manage business operations including clients, projects, tasks, employees, and AI-driven content generation.

## 📋 Features

### Core Modules
- **Authentication & Security**: JWT-based authentication with Role-Based Access Control (Admin, Manager, Employee)
- **Client Management**: Full CRUD operations for managing business clients with search and filtering
- **Project Management**: Organized project tracking with status management and client association
- **Task Management**: Task scheduling with a Kanban-style board view and priority levels
- **AI Integration**: OpenAI-powered content generator for social media, blogs, and emails
- **Dashboard Analytics**: Real-time insights with charts for employee performance, project status, and industry distribution

### Technical Features
- Clean Architecture design pattern
- Responsive UI with Tailwind CSS
- RESTful API with standardized responses
- Database integrity with SQLite foreign keys
- Comprehensive error handling
- Token-based authentication and authorization

## 🏗️ Project Structure

```
erp/
├── backend/
│   ├── src/
│   │   ├── controllers/        # Request handlers
│   │   ├── models/             # Database models
│   │   ├── services/           # Business logic
│   │   ├── middleware/         # Auth & RBAC
│   │   ├── routes/             # API endpoints
│   │   ├── database/           # DB connection & init
│   │   ├── utils/              # Helper functions
│   │   ├── app.js              # Express app setup
│   │   └── server.js           # Server entry point
│   ├── package.json
│   ├── .env                    # Configuration
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   ├── pages/              # Page components
│   │   ├── services/           # API service layer
│   │   ├── context/            # React context (Auth)
│   │   ├── utils/              # Helper functions
│   │   ├── assets/             # Images, fonts
│   │   ├── App.js              # Main app component
│   │   └── index.js            # React entry point
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   ├── .env                    # Configuration
│   └── .env.example
│
└── README.md                   # This file
```

## 📦 Technical Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite3
- **Authentication**: JWT (jsonwebtoken)
- **Password Security**: bcryptjs
- **AI Service**: OpenAI API
- **HTTP Client**: axios

### Frontend
- **UI Framework**: React 18
- **Router**: React Router v6
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **HTTP Client**: axios
- **Icons**: Lucide React

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- OpenAI API key (for AI features)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

   ** Key variables to set:**
   - `PORT`: Server port (default: 5000)
   - `JWT_SECRET`: Your JWT secret key
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `DATABASE_PATH`: Path to SQLite database

4. **Initialize database**
   ```bash
   npm run init-db
   ```

   This creates all tables and seeds an admin user:
   - **Email**: admin@erp.com
   - **Password**: password123
   - **Role**: Admin

5. **Start development server**
   ```bash
   npm run dev
   ```

   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Make sure REACT_APP_API_URL points to your backend
   ```

4. **Start development server**
   ```bash
   npm start
   ```

   App will open at `http://localhost:3000`

## 🔐 Authentication

### Default Admin User
- **Email**: admin@erp.com
- **Password**: password123

### User Roles
1. **Admin**: Full access to all features and user management
2. **Manager**: Can manage projects, tasks, and team members
3. **Employee**: Can view and update assigned tasks

### Protected Routes
All API endpoints (except `/auth/login` and `/auth/register`) require:
- Valid JWT token in Authorization header
- Format: `Authorization: Bearer <token>`

## 📚 API Endpoints

### Authentication
```
POST   /api/auth/register         - Create new user account
POST   /api/auth/login            - Login and get JWT token
GET    /api/auth/verify           - Verify current token
```

### Clients
```
POST   /api/clients               - Create client
GET    /api/clients               - Get all clients
GET    /api/clients/search?q=...  - Search clients
GET    /api/clients/:id           - Get client by ID
PUT    /api/clients/:id           - Update client
DELETE /api/clients/:id           - Delete client
```

### Projects
```
POST   /api/projects              - Create project
GET    /api/projects              - Get all projects
GET    /api/projects/:id          - Get project by ID
GET    /api/projects/client/:id   - Get projects by client
GET    /api/projects/status?s=... - Filter by status
PUT    /api/projects/:id          - Update project
DELETE /api/projects/:id          - Delete project
```

### Tasks
```
POST   /api/tasks                 - Create task
GET    /api/tasks                 - Get all tasks
GET    /api/tasks/:id             - Get task by ID
GET    /api/tasks/project/:id     - Get tasks by project
GET    /api/tasks/user/:id        - Get tasks by assigned user
GET    /api/tasks/status?s=...    - Filter by status
PUT    /api/tasks/:id             - Update task
DELETE /api/tasks/:id             - Delete task
```

### AI Content Generation
```
POST   /api/ai/generate           - Generate content
GET    /api/ai/history            - Get user's generation history
GET    /api/ai/all                - Get all generated content
```

### Dashboard & Analytics
```
GET    /api/dashboard/stats                    - Get summary statistics
GET    /api/dashboard/projects                 - Get project status distribution
GET    /api/dashboard/tasks                    - Get task status distribution
GET    /api/dashboard/employee-performance     - Get employee performance metrics
GET    /api/dashboard/industry-distribution    - Get client industry breakdown
GET    /api/dashboard/project-timeline         - Get project creation timeline
```

## 📊 Database Schema

### Users Table
```sql
id (PK) | name | email (UNIQUE) | password | role | created_at | updated_at
```

### Clients Table
```sql
id (PK) | company_name | industry | contact_name | phone | email | created_at | updated_at
```

### Projects Table
```sql
id (PK) | client_id (FK) | title | description | deadline | status | created_at | updated_at
```

### Tasks Table
```sql
id (PK) | project_id (FK) | assigned_to (FK) | title | description | status | priority | due_date | created_at | updated_at
```

### AI Content Table
```sql
id (PK) | topic | content_type | generated_content | created_by (FK) | created_at
```

## 🎨 UI Components

### Pages
- **Login**: User authentication form
- **Dashboard**: Analytics dashboard with charts and statistics
- **Clients**: Client management with search and CRUD operations
- **Projects**: Project tracking with Kanban/card views
- **Tasks**: Task management with Kanban board and list views
- **AI Tools**: AI content generation with history

### Reusable Components
- **Navbar**: Navigation and user menu
- **ProtectedRoute**: Route protection wrapper
- **Modals**: Add/Edit forms for entities
- **Cards**: Statistics cards with icons
- **Tables**: Data display with sorting/filtering

## 🔄 Workflow Examples

### Creating a New Client
1. Navigate to Clients page
2. Click "Add Client" button
3. Fill in client details (company name, contact name required)
4. Click Save
5. Client appears in the list

### Managing Projects
1. Go to Projects page
2. Click "Add Project" and select a client
3. Enter project title and details
4. Set deadline and initial status
5. Click Save and use Kanban board to track progress

### AI Content Generation
1. Go to AI Tools page
2. Enter topic (e.g., "Social Media Marketing")
3. Select content type (Social Media, Blog, or Email)
4. Click "Generate Content"
5. Copy generated content to clipboard
6. View history of previous generations

## 🐛 Troubleshooting

### Database Connection Error
- Ensure `DATABASE_PATH` in .env points to a valid location
- Run `npm run init-db` to initialize the database

### OpenAI API Error
- Verify your `OPENAI_API_KEY` is valid
- Check your OpenAI account has credits
- Ensure API key is not exposed in version control

### CORS Error
- Check `FRONTEND_URL` in backend .env
- Ensure frontend is running on the URL specified
- Restart backend server after changing CORS settings

### JWT Token Expired
- Log out and log back in
- Token expiry is set in `JWT_EXPIRY` (default: 7d)

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
DATABASE_PATH=./src/database/erp.db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRY=7d
OPENAI_API_KEY=your_openai_api_key_here
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 🚢 Deployment

### Backend (Node/Express)
1. Set `NODE_ENV=production`
2. Choose a hosting platform (Heroku, AWS, Railway, etc.)
3. Set environment variables on the platform
4. Deploy using platform-specific methods

### Frontend (React)
1. Build production bundle: `npm run build`
2. Deploy `build/` folder to static hosting (Vercel, Netlify, AWS S3, etc.)
3. Configure API URL environment variable for production backend

## 📄 API Response Format

### Success Response
```json
{
  "statusCode": 200,
  "data": { /* actual data */ },
  "message": "Operation successful",
  "success": true
}
```

### Error Response
```json
{
  "statusCode": 400,
  "data": null,
  "message": "Error description",
  "success": false
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 📞 Support

For issues, questions, or suggestions:
- Open an GitHub issue
- Contact: support@digitalagencyerp.com

## 🗺️ Roadmap

### Upcoming Features
- [ ] Real-time notifications
- [ ] Advanced reporting and export
- [ ] Team collaboration tools
- [ ] Mobile app (React Native)
- [ ] Payment integration
- [ ] Advanced user permissions
- [ ] Activity audit logs
- [ ] Email notifications
- [ ] File upload and management
- [ ] Multi-language support

---

**Happy coding! 🚀**
