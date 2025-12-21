# 🚀 ICCA Quick Start Guide

Get ICCA running in 5 minutes!

## Option 1: Docker (Easiest - Recommended)

### Prerequisites
- Docker Desktop installed
- Git

### Steps
```bash
# 1. Clone the repository
git clone <your-repo-url>
cd intelligent-client-communication-assistant

# 2. Start everything with one command
docker-compose up --build

# 3. Wait for services to start (30-60 seconds)
# You'll see: "✅ Connected to PostgreSQL database"

# 4. Open your browser
# Frontend: http://localhost:3000
# Backend API: http://localhost:3001/health
```

That's it! The database is automatically created and seeded with sample templates.

---

## Option 2: Manual Setup (More Control)

### Prerequisites
- Node.js 16+ installed
- PostgreSQL 12+ installed and running
- Git

### Step 1: Database Setup (5 minutes)

```bash
# Create database
createdb icca_db

# Or using psql:
psql -U postgres
CREATE DATABASE icca_db;
\q

# Import schema
psql -U postgres -d icca_db -f server/database/schema.sql
```

### Step 2: Backend Setup (2 minutes)

```bash
# Navigate to server folder
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your database credentials
# DATABASE_URL=postgresql://postgres:password@localhost:5432/icca_db

# Start backend server
npm run dev
```

You should see:
```
🚀 ICCA Backend API running on port 3001
✅ Connected to PostgreSQL database
```

### Step 3: Frontend Setup (2 minutes)

Open a new terminal:

```bash
# From project root
npm install

# Start development server
npm run dev
```

You should see:
```
VITE ready in XXX ms
➜  Local:   http://localhost:5173/
```

### Step 4: Access Application

Open http://localhost:5173 in your browser!

---

## 🎯 What You'll See

### 1. Email Editor Screen
- Compose emails with smart suggestions
- Real-time tone detection
- Template selector
- Missing details alerts

### 2. Template Repository
- 6 pre-built professional templates
- Category filtering
- Template preview
- Approval workflow

### 3. Communication History
- Sample email history
- Status tracking
- Search and filter
- Detailed email view

---

## 🧪 Testing the API

### Health Check
```bash
curl http://localhost:3001/health
```

### Get Templates
```bash
curl http://localhost:3001/api/templates
```

### Create Email (requires auth)
```bash
curl -X POST http://localhost:3001/api/emails \
  -H "Content-Type: application/json" \
  -d '{
    "recipient_email": "client@example.com",
    "subject": "Test Email",
    "body": "This is a test email",
    "tone": "professional"
  }'
```

---

## 🔧 Troubleshooting

### Database Connection Failed
```bash
# Check PostgreSQL is running
pg_isready

# Check connection string in server/.env
cat server/.env | grep DATABASE_URL
```

### Port Already in Use
```bash
# Frontend (5173)
lsof -ti:5173 | xargs kill -9

# Backend (3001)
lsof -ti:3001 | xargs kill -9
```

### Docker Issues
```bash
# Stop all containers
docker-compose down

# Remove volumes and restart
docker-compose down -v
docker-compose up --build
```

### Missing Dependencies
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Same for backend
cd server
rm -rf node_modules package-lock.json
npm install
```

---

## 📝 Default Credentials

The database comes with sample data. For testing authentication (when implemented):

```
Email: demo@icca.com
Password: demo123
```

---

## 🎨 Customization

### Change API Port
Edit `server/.env`:
```
PORT=3001
```

### Change Database Name
Edit `server/.env`:
```
DATABASE_URL=postgresql://user:pass@localhost:5432/your_db_name
```

### Add More Templates
1. Go to Template Repository screen
2. Click "Create Template"
3. Fill in details and save

---

## 📚 Next Steps

1. **Explore the UI**: Try all three screens
2. **Test Smart Suggestions**: Type in the email editor and watch suggestions appear
3. **Browse Templates**: Check out the pre-built templates
4. **View History**: See sample email communications
5. **Read Documentation**: Check README.md and DEPLOYMENT.md

---

## 🆘 Need Help?

- Check [README.md](README.md) for detailed documentation
- See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
- Review database schema in `server/database/schema.sql`
- Check API routes in `server/routes/`

---

## ✅ Success Checklist

- [ ] Database created and schema loaded
- [ ] Backend running on port 3001
- [ ] Frontend running on port 5173
- [ ] Can access http://localhost:5173
- [ ] Can see templates in Template Repository
- [ ] Email editor shows smart suggestions
- [ ] Communication history displays sample data

If all checked, you're ready to go! 🎉