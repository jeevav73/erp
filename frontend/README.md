# Frontend - Digital Agency ERP System

React.js frontend for the Digital Agency ERP System with Tailwind CSS and Recharts.

## Quick Start

### Installation
```bash
npm install
```

### Configuration
```bash
cp .env.example .env
```

Default configuration:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Start Development Server
```bash
npm start
```

App opens at `http://localhost:3000`

## Project Structure

```
src/
├── components/        # Reusable React components
│   ├── Navbar.js
│   └── ProtectedRoute.js
├── pages/            # Page components
│   ├── Login.js
│   ├── Dashboard.js
│   ├── Clients.js
│   ├── Projects.js
│   ├── Tasks.js
│   └── AITools.js
├── services/         # API communication
│   ├── api.js        # Axios instance
│   └── apiServices.js # Service methods
├── context/          # React Context
│   └── AuthContext.js
├── utils/            # Helper functions
│   └── helpers.js
├── assets/           # Images, fonts
├── App.js            # Main component
└── index.js          # Entry point
```

## Key Features

### Authentication Context
- Global auth state management
- JWT token handling
- Protected route wrapper
- Automatic logout on token expiration

```javascript
const { user, login, logout, isAuthenticated } = useAuth();
```

### API Service Layer
- Centralized API calls
- Request/response interceptors
- Automatic token injection
- Error handling

```javascript
const { data } = await clientService.getClients();
```

### Protected Routes
```javascript
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

### Responsive Design
- Mobile-first approach
- Tailwind CSS utilities
- Grid/Flexbox layouts
- Touch-friendly UI

## Pages & Components

### Login Page
- Email and password input
- Error handling and messages
- Demo credentials display
- Responsive layout

### Dashboard
- KPI statistics cards
- Project status bar chart
- Task status distribution
- Employee performance metrics
- Industry distribution pie chart

### Clients
- Client table with search
- Add/Edit/Delete modals
- Pagination-ready
- Search filtering

### Projects
- Card-based layout
- Status filtering
- Add/Edit/Delete operations
- Client association
- Deadline tracking

### Tasks
- Dual view modes: Kanban and List
- Status columns (To Do, In Progress, Completed)
- Priority levels
- Due date tracking
- Assign to users

### AI Tools
- Content generation form
- Topic and type selection
- Generation history sidebar
- Copy to clipboard button
- Real-time content display

## Styling with Tailwind CSS

### Color Scheme
- Primary: Indigo (#4F46E5)
- Secondary: Blue (#06B6D4)
- Success: Green (#10B981)
- Warning: Yellow (#F59E0B)
- Error: Red (#EF4444)

### Utility Classes Used
- Grid layouts: `grid`, `grid-cols-*`
- Flex layouts: `flex`, `flex-col`, `gap-*`
- Spacing: `p-*`, `m-*`, `mb-*`
- Shadows: `shadow-md`, `shadow-lg`
- Hover effects: `hover:bg-*`, `hover:text-*`
- Responsive: `md:`, `lg:`

## Charts & Visualizations

Using Recharts library:

```javascript
<BarChart data={data}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="status" />
  <YAxis />
  <Tooltip />
  <Bar dataKey="count" fill="#4F46E5" />
</BarChart>
```

Chart types:
- Bar charts (Project/Task status)
- Line charts (Timeline data)
- Pie charts (Industry distribution)

## Forms & Modals

### Modal Pattern
```javascript
const [isOpen, setIsOpen] = useState(false);

{isOpen && (
  <Modal onClose={() => setIsOpen(false)}>
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  </Modal>
)}
```

### Form Validation
- Required field validation
- Email format validation
- Type checking

## API Integration

### Service Methods Structure
```javascript
export const clientService = {
  createClient: (data) => api.post('/clients', data),
  getClients: () => api.get('/clients'),
  updateClient: (id, data) => api.put(`/clients/${id}`, data),
  deleteClient: (id) => api.delete(`/clients/${id}`)
};
```

### Usage
```javascript
try {
  const response = await clientService.getClients();
  setClients(response.data.data);
} catch (error) {
  setError(error.response?.data?.message);
}
```

## State Management

### Local State
```javascript
const [clients, setClients] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');
```

### Global State (Auth Context)
```javascript
const { user, login, logout } = useAuth();
```

### Local Storage
```javascript
localStorage.setItem('authToken', token);
const token = localStorage.getItem('authToken');
localStorage.removeItem('authToken');
```

## Utility Functions

### Date Formatting
```javascript
formatDate('2024-01-15')     // Jan 15, 2024
formatDateTime('2024-01-15') // Jan 15, 2024, 10:30 AM
```

### Status Colors
```javascript
getStatusColor('Completed')  // green badge
getPriorityColor('High')     // red badge
```

### Clipboard
```javascript
const copied = await copyToClipboard(text);
```

## Environment Variables

```
REACT_APP_API_URL=http://localhost:5000/api
```

## Development Workflow

### Adding a New Page

1. Create component in `src/pages/`
```javascript
export default function NewPage() {
  // Component logic
}
```

2. Import in `App.js`
```javascript
import NewPage from './pages/NewPage';
```

3. Add route
```javascript
<Route path="/new-page" element={<ProtectedRoute><NewPage /></ProtectedRoute>} />
```

4. Add navigation link in `Navbar.js`
```javascript
<Link to="/new-page">New Page</Link>
```

### Adding a New API Service

1. Create service in `src/services/apiServices.js`
```javascript
export const newService = {
  getAll: () => api.get('/endpoint'),
  getById: (id) => api.get(`/endpoint/${id}`),
};
```

2. Use in component
```javascript
const response = await newService.getAll();
```

## Performance Optimization

- **Code Splitting**: Routes loaded on demand
- **Lazy Loading**: Images lazy load
- **Memoization**: React.memo for components
- **State Optimization**: Minimize re-renders

```javascript
const MemoizedComponent = React.memo(Component);
```

## Error Handling

```javascript
try {
  const response = await apiCall();
  setData(response.data.data);
} catch (error) {
  const message = error.response?.data?.message || 'An error occurred';
  setError(message);
}
```

## Common Issues

**Blank Page**
- Check browser console for errors
- Verify backend is running
- Check .env configuration

**API Calls Failing**
- Verify backend URL in .env
- Check CORS settings in backend
- Verify JWT token is valid

**Styling Issues**
- Tailwind CSS requires build process
- Run `npm start` instead of opening HTML directly
- Clear browser cache

## Scripts

```bash
npm start       # Start development server
npm build       # Build for production
npm test        # Run tests
npm eject       # Eject from create-react-app (irreversible)
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Dependencies

- **react**: UI library
- **react-router-dom**: Routing
- **axios**: HTTP client
- **recharts**: Charting library
- **tailwindcss**: CSS framework
- **lucide-react**: Icons

## Next Steps

- [ ] Add form validation library (React Hook Form)
- [ ] Implement error boundary
- [ ] Add loading skeletons
- [ ] Implement infinite scroll
- [ ] Add dark mode
- [ ] Create component library
- [ ] Add E2E tests (Cypress)
- [ ] Setup CI/CD pipeline

---

For full documentation, see [parent README.md](../README.md)
