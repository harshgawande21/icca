<<<<<<< HEAD
# ICCA - Intelligent Client Communication Assistant

A UI-first system that helps teams choose, customize, and send professional emails using template repositories, with smart tone and content suggestions.

## 🎯 What is ICCA?

ICCA is **NOT** an email auto-generator. Instead, it's an intelligent assistant that helps humans send better, more professional emails by:

- Providing smart suggestions for tone and content
- Offering curated email templates
- Highlighting missing details (pricing, dates, SLAs)
- Ensuring professional wording and structure

## ✨ Core Features

### 📩 Email Use Cases
- Client follow-up emails
- Cost clarification / pricing emails  
- Status update emails
- Service reminder emails

### 🧠 Smart Assistance
- **Tone Detection**: Automatically suggests Professional / Polite / Urgent tone
- **Template Recommendations**: Suggests best template from repository
- **Missing Details Alert**: Highlights missing pricing, dates, SLA information
- **Professional Wording Check**: Ensures business-appropriate language

## 🖥️ UI Screens

### 1. Email Editor with Smart Suggestions
- Real-time subject line suggestions
- Tone indicator badges
- Template selector with one-click application
- Missing details warnings
- Professional wording validation

### 2. Email Template Repository
- Categorized templates (Follow-up, Pricing, Updates, Reminders, etc.)
- Template preview functionality
- Status tracking (Approved / Draft)
- Search and filter capabilities

### 3. Client Communication History
- Complete sent emails log
- Status tracking (Sent / Pending / Failed)
- Notes and follow-up tracking
- Search and filter functionality

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- PostgreSQL 12+
- npm or yarn

### Quick Start with Docker (Recommended)

1. Clone the repository
```bash
git clone <repository-url>
cd intelligent-client-communication-assistant
```

2. Start with Docker Compose
```bash
docker-compose up --build
```

3. Access the application
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Database: localhost:5432

### Manual Installation

1. **Setup Database**
```bash
# Install PostgreSQL and create database
createdb icca_db
psql icca_db -f server/database/schema.sql
```

2. **Backend Setup**
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run dev
```

3. **Frontend Setup**
```bash
npm install
npm run dev
```

4. Open your browser to `http://localhost:5173`

## 🛠️ Technology Stack

### Frontend
- **React 18** with Vite
- **React Router DOM** for navigation
- **Lucide React** for icons
- **Axios** for API communication
- **Custom CSS** with modern design system

### Backend
- **Node.js** with Express.js
- **PostgreSQL** database with connection pooling
- **JWT** authentication
- **bcryptjs** for password hashing
- **Helmet** for security headers
- **Rate limiting** for API protection

### Database Schema
- **Users**: Authentication and user management
- **Email Templates**: Categorized template library
- **Clients**: Client information and contact details
- **Email Communications**: Complete email history and tracking
- **Template Categories**: Organized template management

## 📁 Project Structure

```
src/
├── components/
│   ├── EmailEditor.jsx          # Main email composition interface
│   ├── TemplateRepository.jsx   # Template management and preview
│   └── CommunicationHistory.jsx # Email history and tracking
├── App.jsx                      # Main app component with routing
├── main.jsx                     # React app entry point
└── index.css                    # Global styles and design system
```

## 🎨 Design Philosophy

- **Clean, Professional Interface**: Focused on productivity and ease of use
- **Smart Assistance, Not Automation**: Enhances human decision-making rather than replacing it
- **Template-Driven Workflow**: Promotes consistency and best practices
- **Real-time Feedback**: Immediate suggestions and validation

## 🔧 Key Components

### EmailEditor
- Smart tone detection based on content analysis
- Real-time subject line suggestions
- Template integration with one-click application
- Missing details detection (pricing, dates, SLAs)

### TemplateRepository  
- Categorized template library
- Live preview functionality
- Approval workflow (Draft/Approved status)
- Template search and filtering

### CommunicationHistory
- Complete email audit trail
- Status tracking and notes
- Advanced search and filtering
- Client communication timeline

## 📈 Future Enhancements

- Integration with email providers (Gmail, Outlook)
- Advanced AI-powered content suggestions
- Team collaboration features
- Analytics and reporting dashboard
- Custom template creation wizard

## 🤝 Contributing

This project is designed as a portfolio demonstration. For suggestions or improvements, please open an issue or submit a pull request.

## 📄 License

MIT License - see LICENSE file for details.

---

**ICCA** - Making professional client communication effortless and consistent.

## 🌐 Production Deployment

### Recommended Hosting Options

**For Real-World Deployment:**

1. **Vercel (Frontend) + Railway (Backend + Database)**
   - Frontend: Deploy to Vercel with one click
   - Backend: Railway provides PostgreSQL + Node.js hosting
   - Cost: ~$5-20/month depending on usage

2. **Heroku (Full Stack)**
   - Add PostgreSQL addon
   - Deploy both frontend and backend
   - Cost: ~$7-25/month

3. **AWS (Enterprise)**
   - RDS for PostgreSQL
   - Elastic Beanstalk for backend
   - S3 + CloudFront for frontend
   - Cost: Variable based on usage

### Database Hosting Options

- **Railway**: Managed PostgreSQL with automatic backups
- **Heroku Postgres**: Reliable with easy scaling
- **AWS RDS**: Enterprise-grade with advanced features
- **DigitalOcean Managed Databases**: Cost-effective option
- **Supabase**: PostgreSQL with additional features

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## 📊 Database Schema

The application uses a robust PostgreSQL schema with:

- **Normalized relationships** between users, clients, templates, and emails
- **JSONB fields** for flexible metadata storage
- **Automatic timestamps** with triggers
- **Proper indexing** for performance
- **Data integrity** with foreign key constraints

Key tables:
- `users` - Authentication and user management
- `email_templates` - Template library with versioning
- `clients` - Client contact information
- `email_communications` - Complete email audit trail
- `template_categories` - Organized template management

## 🔐 Security Features

- **JWT Authentication** with secure token handling
- **Password Hashing** using bcryptjs with salt rounds
- **Rate Limiting** to prevent API abuse
- **CORS Protection** with configurable origins
- **SQL Injection Prevention** with parameterized queries
- **Security Headers** via Helmet middleware
- **Input Validation** on all API endpoints
=======
# icca
 **ICCA (Intelligent Client Communication Assistant)** is a comprehensive, full-stack web application designed to streamline and enhance professional email communication for businesses and teams. The platform combines intelligent email composition with a robust template management system, providing users with AI-like suggestions 
>>>>>>> 80bb8ef4d0f57e4ca764bff95a9ec7279c7227cb
