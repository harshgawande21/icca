# ICCA Deployment Guide

This guide covers multiple deployment options for the Intelligent Client Communication Assistant (ICCA).

## 🗄️ Database: PostgreSQL

ICCA uses **PostgreSQL** as its primary database. Here's why it's perfect for production:

- **Reliability**: ACID compliant, battle-tested in enterprise environments
- **Scalability**: Handles millions of records with proper indexing
- **JSON Support**: Native JSONB for storing email metadata and templates
- **Full-text Search**: Built-in search capabilities for emails and templates
- **Backup & Recovery**: Robust backup and point-in-time recovery options

## 🚀 Deployment Options

### Option 1: Docker Compose (Recommended for Development)

```bash
# Clone the repository
git clone <your-repo-url>
cd intelligent-client-communication-assistant

# Copy environment file
cp server/.env.example server/.env

# Edit environment variables
nano server/.env

# Start all services
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:3001
# Database: localhost:5432
```

### Option 2: Cloud Deployment (Production Ready)

#### A. Vercel + Railway (Recommended)

**Frontend on Vercel:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
vercel --prod

# Set environment variables in Vercel dashboard:
# VITE_API_URL=https://your-backend-url.railway.app/api
```

**Backend + Database on Railway:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Deploy backend with PostgreSQL
railway up

# Railway will automatically:
# - Create PostgreSQL database
# - Set DATABASE_URL environment variable
# - Deploy your backend API
```

#### B. Heroku (Alternative)

**Database Setup:**
```bash
# Add PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev

# Run database migrations
heroku run npm run migrate
```

**Backend Deployment:**
```bash
# Create Heroku app
heroku create icca-backend

# Set environment variables
heroku config:set JWT_SECRET=your-super-secret-key
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

#### C. AWS (Enterprise)

**Database (RDS):**
- Create PostgreSQL RDS instance
- Configure security groups
- Note connection string

**Backend (Elastic Beanstalk or ECS):**
- Deploy Node.js application
- Set environment variables
- Configure load balancer

**Frontend (S3 + CloudFront):**
- Build React app: `npm run build`
- Upload to S3 bucket
- Configure CloudFront distribution

### Option 3: VPS/Dedicated Server

```bash
# Install Node.js and PostgreSQL
sudo apt update
sudo apt install nodejs npm postgresql postgresql-contrib nginx

# Setup PostgreSQL
sudo -u postgres createdb icca_db
sudo -u postgres createuser icca_user
sudo -u postgres psql -c "ALTER USER icca_user PASSWORD 'secure_password';"

# Clone and setup application
git clone <your-repo-url>
cd intelligent-client-communication-assistant

# Install dependencies
npm install
cd server && npm install

# Setup environment
cp .env.example .env
# Edit .env with your database credentials

# Run database migrations
npm run migrate

# Install PM2 for process management
npm install -g pm2

# Start backend
cd server
pm2 start server.js --name icca-backend

# Build and serve frontend
cd ..
npm run build
sudo cp -r dist/* /var/www/html/

# Configure Nginx (see nginx.conf)
sudo systemctl restart nginx
```

## 🔧 Environment Variables

### Backend (.env)
```bash
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Server
PORT=3001
NODE_ENV=production

# Security
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters

# CORS
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Frontend (.env)
```bash
# API URL
VITE_API_URL=https://your-backend-domain.com/api
```

## 📊 Database Setup

### 1. Create Database
```sql
CREATE DATABASE icca_db;
CREATE USER icca_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE icca_db TO icca_user;
```

### 2. Run Schema
```bash
# Connect to your PostgreSQL instance
psql -h hostname -U icca_user -d icca_db -f server/database/schema.sql
```

### 3. Verify Setup
```bash
# Check tables were created
psql -h hostname -U icca_user -d icca_db -c "\dt"
```

## 🔒 Security Checklist

- [ ] Change default JWT secret
- [ ] Use strong database passwords
- [ ] Enable SSL/TLS for database connections
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable HTTPS
- [ ] Regular security updates
- [ ] Database backups
- [ ] Monitor logs

## 📈 Performance Optimization

### Database
- Create indexes on frequently queried columns
- Regular VACUUM and ANALYZE
- Connection pooling (already configured)
- Read replicas for high traffic

### Backend
- Enable gzip compression
- Use Redis for caching
- Implement API rate limiting
- Monitor with APM tools

### Frontend
- Enable CDN
- Optimize bundle size
- Implement lazy loading
- Use service workers for caching

## 🔍 Monitoring

### Health Checks
- Backend: `GET /health`
- Database: Connection pool monitoring
- Frontend: Uptime monitoring

### Logging
- Application logs: Winston/Pino
- Database logs: PostgreSQL logs
- Access logs: Nginx/Apache logs

### Metrics
- Response times
- Error rates
- Database performance
- User activity

## 🆘 Troubleshooting

### Common Issues

**Database Connection Failed:**
```bash
# Check connection string
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT version();"
```

**CORS Errors:**
```bash
# Check CORS_ORIGINS environment variable
# Ensure frontend URL is included
```

**JWT Token Issues:**
```bash
# Verify JWT_SECRET is set
# Check token expiration (default: 7 days)
```

### Backup & Recovery

**Database Backup:**
```bash
# Create backup
pg_dump $DATABASE_URL > icca_backup.sql

# Restore backup
psql $DATABASE_URL < icca_backup.sql
```

**Application Backup:**
```bash
# Backup uploaded files and configs
tar -czf icca_app_backup.tar.gz server/ src/ package.json
```

## 📞 Support

For deployment issues:
1. Check logs first
2. Verify environment variables
3. Test database connectivity
4. Check network/firewall settings

---

**Production Checklist:**
- [ ] Database configured and migrated
- [ ] Environment variables set
- [ ] SSL certificates installed
- [ ] Monitoring configured
- [ ] Backups scheduled
- [ ] Security headers configured
- [ ] Performance optimized