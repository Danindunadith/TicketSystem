# Intelligent Ticket Management System (ITPM)

An advanced, full-stack IT support ticket management system with AI-powered features for enhanced customer support and efficient ticket resolution.

## 🌟 Overview

This comprehensive ticket management system combines modern web technologies with artificial intelligence to provide an intelligent, efficient, and user-friendly support experience. The system features automated ticket analysis, sentiment detection, priority prediction, and smart categorization to streamline support operations.

## 🚀 Key Features

### 🎯 Core Ticket Management
- **Create & Track Tickets**: Complete ticket lifecycle management with unique auto-generated IDs
- **Multi-Department Support**: Organize tickets across different departments and services
- **Priority Management**: Automated and manual priority assignment (Low, Medium, High, Critical)
- **Status Tracking**: Real-time status updates (Open, In Progress, Resolved, Closed)
- **File Attachments**: Support for document and media uploads

### 🤖 AI-Powered Features
- **Sentiment Analysis**: Automatic emotion detection and sentiment scoring for better customer understanding
- **Smart Categorization**: AI-powered ticket categorization with confidence scoring
- **Priority Prediction**: Intelligent priority suggestion based on ticket content and urgency
- **Automated Responses**: AI-generated initial responses for common issues
- **Escalation Detection**: Automatic identification of tickets requiring immediate attention
- **Resolution Time Estimation**: Predictive analytics for ticket resolution timeframes

### 👥 User Management
- **Multi-Role System**: Support for customers, support agents, and administrators
- **Authentication & Authorization**: Secure JWT-based user authentication
- **User Profiles**: Comprehensive user management with profile customization
- **Employee Management**: Built-in HR system for managing support staff

### 📊 Analytics & Reporting
- **Real-time Dashboards**: Comprehensive analytics for tickets, performance, and trends
- **Visual Charts**: Interactive charts using Chart.js, Recharts, and Victory
- **PDF Reports**: Automated report generation with jsPDF
- **Performance Metrics**: KPI tracking for support team efficiency

### 💬 Communication Features
- **Ticket Replies**: Threaded conversation system for ticket updates
- **Email Notifications**: Automated email confirmations and updates using EmailJS
- **Real-time Updates**: Live ticket status and reply notifications

### 🏢 Additional Modules
- **Inventory Management**: Built-in stock and order management system
- **Product Reviews**: Customer feedback and review management
- **Inquiry System**: Pre-support inquiry handling
- **People Management**: Contact and stakeholder management

## 🏗️ Technical Architecture

### Backend (ITPM_backend)
- **Framework**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Multer for file upload handling
- **AI Integration**: Custom AI controllers for ticket analysis
- **API**: RESTful API design with comprehensive route handling

**Key Dependencies:**
- Express.js for server framework
- Mongoose for MongoDB integration
- bcrypt for password hashing
- jsonwebtoken for authentication
- multer for file uploads
- cors for cross-origin support

### Frontend (ITPM_frontend)
- **Framework**: React 18 with Vite for fast development
- **Styling**: Tailwind CSS for modern, responsive design
- **Routing**: React Router DOM for single-page application navigation
- **State Management**: React hooks for state management
- **Charts**: Multiple charting libraries (Chart.js, Recharts, Victory)
- **Notifications**: React Hot Toast for user feedback
- **Icons**: Lucide React and React Icons for comprehensive icon sets

**Key Dependencies:**
- React & React DOM for frontend framework
- Vite for build tooling and development
- Tailwind CSS for styling
- Axios for API communication
- React Router DOM for navigation
- Chart.js, Recharts, Victory for data visualization

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Backend Setup
1. Navigate to the backend directory:
```bash
cd ITPM_backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```env
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=3002
```

4. Start the development server:
```bash
npm start
```

### Frontend Setup
1. Navigate to the frontend directory:
```bash
cd ITPM_frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with:
```env
VITE_BACKEND_URL=http://localhost:3002
```

4. Start the development server:
```bash
npm run dev
```

## 👤 Default Admin Credentials
- **Email**: upadhi10@gmail.com
- **Password**: word123

## 📋 API Endpoints

### Ticket Management
- `POST /api/tickets` - Create new ticket
- `GET /api/tickets` - Get all tickets
- `GET /api/tickets/:id` - Get specific ticket
- `PUT /api/tickets/:id` - Update ticket
- `DELETE /api/tickets/:id` - Delete ticket

### AI Features
- `POST /api/ai/predict-category` - Predict ticket category
- `POST /api/ai/analyze-emotion` - Analyze sentiment and emotions
- `POST /api/ai/comprehensive-analysis` - Complete ticket analysis
- `POST /api/ai/instant-help` - Get automated solutions

### User Management
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User authentication
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## 🔧 Development Features

### Code Quality
- ESLint configuration for code consistency
- Modular architecture for maintainability
- Error handling and validation
- Security best practices with JWT and bcrypt

### Performance Optimization
- Vite for fast development and building
- Lazy loading for improved performance
- Optimized database queries with indexing
- Efficient file upload and storage

### Scalability
- Modular component architecture
- Separation of concerns between frontend and backend
- Database design optimized for growth
- API versioning support

## 🤝 Contributing

This system is designed with modularity and extensibility in mind. Key areas for enhancement include:
- Additional AI models for better prediction accuracy
- Integration with external support tools
- Mobile application development
- Advanced analytics and machine learning features

## 📄 License

This project is part of an ITPM (Information Technology Project Management) coursework and follows academic licensing guidelines.

---

*This intelligent ticket management system represents a modern approach to IT support, combining traditional ticketing functionality with cutting-edge AI capabilities to provide superior customer service and operational efficiency.*
