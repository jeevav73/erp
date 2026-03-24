# 🚀 Quick Start Guide - Digital Agency ERP

Get the complete ERP system running in 5 minutes!

## 📋 Prerequisites

- Node.js (v14+)
- npm or yarn
- OpenAI API Key (for AI features)

## 🔧 Step 1: Backend Setup (2 minutes)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Update configuration (optional for demo)
# The .env file has demo values pre-configured

# Initialize database with tables and seed data
npm run init-db

# Start backend server
npm run dev
```

✅ Backend running at: `http://localhost:5000`

## 🎨 Step 2: Frontend Setup (2 minutes)

Open a new terminal:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

✅ Frontend will open at: `http://localhost:3000`

## 🔐 Step 3: Login

Use the default admin credentials:

- **Email**: `admin@erp.com`
- **Password**: `password123`

## 🎯 What You Get

### ✨ Fully Functional Modules

1. **Dashboard** - Real-time analytics with charts
   - Total clients, active projects, completed tasks
   - Project status distribution
   - Employee performance metrics
   - Industry breakdown

2. **Clients** - Complete client management
   - Create, read, update, delete clients
   - Search and filter functionality
   - Company details and contact information

3. **Projects** - Project tracking system
   - Link projects to clients
   - Track project status (Pending, In Progress, Completed)
   - Set deadlines
   - Both card and list views

4. **Tasks** - Task management with Kanban board
   - Create tasks for projects
   - Kanban board view with auto-status columns
   - Priority levels (Low, Medium, High)
   - List view option

5. **AI Tools** - AI-powered content generation
   - Generate social media captions
   - Create blog post ideas
   - Draft email campaigns
   - Copy generated content with one click

6. **Authentication** - Secure login system
   - JWT token-based auth
   - Role-based access control
   - Protection for sensitive routes

## 📁 Project Structure

```
erp/
├── backend/          ← Express API server
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── services/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── database/
│   ├── package.json
│   └── .env
│
├── frontend/         ← React application
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   ├── context/
│   │   └── utils/
│   ├── package.json
│   └── .env
│
└── README.md         ← Full documentation
```

## 🔑 Key Features

### Clean Architecture
- Separated concerns: Controllers → Services → Models
- Reusable middleware
- Standardized API responses

### Database
- SQLite with relational design
- Foreign key constraints
- Pre-configured schema

### Frontend
- React 18 with hooks
- Tailwind CSS styling
- Responsive design
- Recharts visualization

### Security
- JWT authentication
- Password hashing with bcryptjs
- Role-based access control
- Protected API endpoints

## 🧪 Testing the API

### Create a Client
```bash
curl -X POST http://localhost:5000/api/clients \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"company_name":"Tech Corp","contact_name":"John Doe","industry":"Tech"}'
```

### Get All Clients
```bash
curl http://localhost:5000/api/clients \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Generate AI Content
```bash
curl -X POST http://localhost:5000/api/ai/generate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"topic":"Digital Marketing","content_type":"Social Media"}'
```

## ⚙️ Configuration

### Backend (.env)
```
JWT_SECRET=your_secret_key
OPENAI_API_KEY=sk-your-key-here
DATABASE_PATH=./src/database/erp.db
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 🐛 Troubleshooting

**Backend won't start**
- Check if port 5000 is available
- Run `npm install` in backend folder
- Check Node version: `node --version`

**Frontend shows blank page**
- Check browser console (F12)
- Verify backend is running
- Clear cache: Ctrl+Shift+Delete

**API calls failing**
- Check backend is running on port 5000
- Verify JWT token is valid
- Check CORS settings in backend

**Database locked**
- Delete `.db-shm` and `.db-wal` files
- Restart backend

## 📚 Documentation

- **Full API Docs**: See [README.md](./README.md)
- **Backend Docs**: See [backend/README.md](./backend/README.md)
- **Frontend Docs**: See [frontend/README.md](./frontend/README.md)

## 🎓 Learning Path

1. ✅ Explore Dashboard - See system overview
2. ✅ Create Clients - Add test data
3. ✅ Create Projects - Link to clients
4. ✅ Create Tasks - Try Kanban board
5. ✅ Try AI Tools - Experience AI features
6. ✅ Study Code - Learn the architecture

## 📦 Next Steps

### Production Deployment
1. Build frontend: `npm run build`
2. Set environment variables
3. Deploy to hosting (Vercel, Netlify, Heroku)

### Development Enhancement
1. Add more models as needed
2. Implement advanced filtering
3. Add file uploads
4. Setup email notifications

### Code Quality
1. Add unit tests
2. Setup linting (ESLint)
3. Add API documentation (Swagger)
4. Implement logging

## 💡 Pro Tips

- **Search by typing**: Client and project search works real-time
- **Kanban board**: Drag tasks between columns (will be added)
- **Copy to clipboard**: One-click copy for AI-generated content
- **Status filtering**: Use status buttons to filter projects/tasks
- **Mobile responsive**: Works on tablets and phones

## 🆘 Need Help?

1. Check the console for error messages
2. Review the comprehensive README files
3. Check backend logs: Look for error messages in terminal
4. Verify all environment variables are set

## 🎉 Success!

You now have a fully functional ERP system running with:
- ✅ Complete authentication system
- ✅ Client management
- ✅ Project tracking
- ✅ Task management with Kanban
- ✅ AI content generation
- ✅ Database analytics
- ✅ Responsive UI
- ✅ Clean architecture

Happy coding! 🚀
