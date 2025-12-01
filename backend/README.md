# 📰 Telugu E-Paper Website

A modern, responsive Telugu digital newspaper platform built with React, Node.js, and SQLite. Features include admin panel for newspaper management, PDF viewer for reading papers, and date-based navigation.

## 🌟 **Live Demo**
- **Frontend**: [Your Vercel Frontend URL]
- **Backend API**: [Your Vercel Backend URL]

## ✨ **Features**
- 📱 **Responsive Design** - Works on all devices
- 🔐 **Admin Panel** - Secure newspaper upload and management
- 📅 **Date Navigation** - Easy access to previous 6 days
- 📄 **PDF Viewer** - Native browser PDF viewing
- 🗑️ **Auto Cleanup** - Removes papers older than 7 days
- 🎨 **Telugu UI** - Native Telugu language support

## Features

### Admin Panel
- Secure admin login
- Upload daily e-paper in PDF format
- Manage existing uploads (view, replace, delete)
- Automatic cleanup of papers older than 7 days
- File upload progress tracking
- Responsive dashboard with statistics

### User Panel
- View today's e-paper with integrated PDF viewer
- Browse previous 6 days' editions
- Crop and download sections as JPG images
- Responsive design for all devices
- Fast PDF rendering with page navigation
- Zoom controls for better readability

### Technical Features
- JWT-based authentication
- File upload with validation (PDF only, 50MB max)
- PostgreSQL database with optimized queries
- Automatic daily cleanup job
- CORS and security middleware
- Rate limiting and error handling
- PDF parsing for page count extraction

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, React-PDF, React Router
- **Backend**: Node.js, Express, PostgreSQL, JWT, Multer
- **Database**: PostgreSQL with connection pooling
- **Additional**: PDF.js, HTML2Canvas, Cropper.js, React Hot Toast

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd telugu-digital-newspaper
```

### 2. Database Setup
```bash
# Install PostgreSQL and create database
createdb telugu_epaper

# Or use the provided SQL script
psql -U postgres -f server/setup-database.sql
```

### 3. Backend Setup
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Copy environment file and configure
cp .env.example .env

# Edit .env file with your database credentials
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=telugu_epaper
# DB_USER=postgres
# DB_PASSWORD=your_password
# JWT_SECRET=your_super_secret_jwt_key_here
```

### 4. Frontend Setup
```bash
# Navigate back to root directory
cd ..

# Install dependencies
npm install
```

### 5. Environment Configuration

Create `.env.local` in the root directory:
```env
VITE_API_URL=http://localhost:5000/api
```

## Running the Application

### Development Mode

1. **Start the backend server:**
```bash
cd server
npm run dev
```
The server will run on http://localhost:5000

2. **Start the frontend development server:**
```bash
# In root directory
npm run dev
```
The frontend will run on http://localhost:3000

### Production Mode

1. **Build the frontend:**
```bash
npm run build
```

2. **Start the backend:**
```bash
cd server
npm start
```

## Default Admin Credentials

- **Email**: admin@teluguepaper.com
- **Password**: admin123

*Change these credentials in the `.env` file before production deployment.*

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify JWT token
- `POST /api/auth/logout` - Logout (client-side)

### Papers
- `GET /api/papers` - Get all papers
- `GET /api/papers/:date` - Get paper by date (YYYY-MM-DD)
- `GET /api/papers/recent/:days` - Get recent papers
- `POST /api/papers/upload` - Upload new paper (admin only)
- `DELETE /api/papers/:id` - Delete paper (admin only)
- `PUT /api/papers/:id/replace` - Replace paper (admin only)

## Project Structure

```
telugu-digital-newspaper/
├── src/
│   ├── components/
│   │   ├── admin/          # Admin panel components
│   │   ├── user/           # User-facing components
│   │   └── common/         # Shared components
│   ├── contexts/           # React contexts
│   ├── services/           # API services
│   ├── utils/              # Utility functions
│   └── types.ts            # TypeScript types
├── server/
│   ├── config/             # Database configuration
│   ├── middleware/         # Express middleware
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   └── index.js            # Server entry point
├── public/                 # Static assets
└── uploads/                # Uploaded PDF files (created automatically)
```

## Key Features Implementation

### PDF Viewing
- Uses React-PDF library for rendering
- Page navigation with zoom controls
- Responsive design for mobile devices

### Image Cropping
- Custom crop tool with drag selection
- Downloads cropped area as JPG with header/footer
- Includes website logo and edition date

### File Management
- Secure file upload with validation
- Automatic file cleanup after 7 days
- Progress tracking during uploads

### Security
- JWT-based authentication
- Rate limiting on API endpoints
- File type and size validation
- CORS configuration

## Deployment

### Database
1. Set up PostgreSQL database
2. Configure connection parameters in `.env`
3. The application will create tables automatically

### Backend
1. Set environment variables
2. Install dependencies: `npm install`
3. Start server: `npm start`

### Frontend
1. Build the application: `npm run build`
2. Serve the `dist` folder using a web server
3. Configure API URL in environment variables

## Environment Variables

### Backend (.env)
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=telugu_epaper
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=production
ADMIN_EMAIL=admin@teluguepaper.com
ADMIN_PASSWORD=admin123
UPLOAD_DIR=uploads
MAX_FILE_SIZE=52428800
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:5000/api
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please create an issue in the repository.
