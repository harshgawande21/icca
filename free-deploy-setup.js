#!/usr/bin/env node

const fs = require('fs');

console.log('🆓 ICCA Free Deployment Setup');
console.log('💰 Total Cost: $0/month forever!');
console.log('');

// Create optimized package.json for free tiers
console.log('⚡ Optimizing for free hosting tiers...');

// Update server package.json for better free tier performance
const serverPackagePath = 'server/package.json';
if (fs.existsSync(serverPackagePath)) {
  const serverPackage = JSON.parse(fs.readFileSync(serverPackagePath, 'utf8'));
  
  // Add memory optimization for free tiers
  serverPackage.scripts = {
    ...serverPackage.scripts,
    "start:free": "node --max-old-space-size=512 server.js",
    "start": "node server.js"
  };
  
  // Add engines for compatibility
  serverPackage.engines = {
    "node": ">=16.0.0",
    "npm": ">=8.0.0"
  };
  
  fs.writeFileSync(serverPackagePath, JSON.stringify(serverPackage, null, 2));
  console.log('✅ Optimized server package.json for free tiers');
}

// Create Render configuration
const renderConfig = {
  "services": [
    {
      "type": "web",
      "name": "icca-backend",
      "env": "node",
      "rootDir": "./server",
      "buildCommand": "npm install",
      "startCommand": "npm start",
      "plan": "free",
      "healthCheckPath": "/health",
      "envVars": [
        {
          "key": "NODE_ENV",
          "value": "production"
        },
        {
          "key": "PORT",
          "value": "10000"
        }
      ]
    }
  ]
};

fs.writeFileSync('render.yaml', JSON.stringify(renderConfig, null, 2));
console.log('✅ Created render.yaml configuration');

// Create Netlify configuration (alternative)
const netlifyConfig = `[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "https://your-backend.onrender.com/api/:splat"
  status = 200
  force = true

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200`;

fs.writeFileSync('netlify.toml', netlifyConfig);
console.log('✅ Created netlify.toml configuration');

// Create free deployment environment files
const freeEnvFrontend = `# Free Deployment Environment Variables - Frontend
# Set these in your hosting platform (Vercel/Netlify)

# Backend API URL (replace with your Render URL)
VITE_API_URL=https://your-backend.onrender.com/api`;

fs.writeFileSync('.env.free', freeEnvFrontend);

const freeEnvBackend = `# Free Deployment Environment Variables - Backend  
# Set these in your hosting platform (Render/Railway)

# Database (use your Neon PostgreSQL URL)
DATABASE_URL=postgresql://username:password@host/database?sslmode=require

# Server Configuration
NODE_ENV=production
PORT=10000

# Security (CHANGE THIS!)
JWT_SECRET=icca-free-deployment-secure-jwt-secret-2024-change-this-now

# CORS (replace with your frontend URL)
CORS_ORIGINS=https://your-app.vercel.app`;

fs.writeFileSync('server/.env.free', freeEnvBackend);
console.log('✅ Created free deployment environment templates');

// Create UptimeRobot configuration helper
const uptimeConfig = `# UptimeRobot Configuration (Keep your free backend awake)

## Setup Instructions:
1. Go to https://uptimerobot.com
2. Create free account
3. Add new monitor:
   - Type: HTTP(s)
   - URL: https://your-backend.onrender.com/health
   - Monitoring Interval: 5 minutes
   - Alert Contacts: Your email

## Why This Helps:
- Render free tier sleeps after 15 minutes of inactivity
- UptimeRobot pings your backend every 5 minutes
- Keeps your app responsive for users
- 100% free solution

## Alternative: Cron-job.org
- Visit https://cron-job.org
- Create free account  
- Add job to ping your backend every 10 minutes
- URL: https://your-backend.onrender.com/health`;

fs.writeFileSync('UPTIME_SETUP.md', uptimeConfig);
console.log('✅ Created uptime monitoring guide');

// Create free deployment checklist
const freeChecklist = `# 🆓 Free Deployment Checklist

## ✅ Pre-Deployment (5 minutes)
- [ ] Code pushed to GitHub
- [ ] All files committed
- [ ] Environment templates created
- [ ] Database schema ready

## 🗄️ Database Setup - Neon (5 minutes)
- [ ] Create account at https://neon.tech
- [ ] Create new project: "icca-database"
- [ ] Copy connection string
- [ ] Open SQL Editor
- [ ] Paste and run server/database/schema.sql
- [ ] Verify 6 tables created
- [ ] Save DATABASE_URL for backend

## ⚙️ Backend Deploy - Render (8 minutes)
- [ ] Create account at https://render.com
- [ ] New Web Service from GitHub
- [ ] Root Directory: server
- [ ] Build Command: npm install
- [ ] Start Command: npm start
- [ ] Add environment variables:
  - [ ] NODE_ENV=production
  - [ ] PORT=10000
  - [ ] DATABASE_URL=(from Neon)
  - [ ] JWT_SECRET=(strong secret)
  - [ ] CORS_ORIGINS=(will update later)
- [ ] Deploy and wait 5-8 minutes
- [ ] Copy backend URL
- [ ] Test: visit your-url/health

## 🎨 Frontend Deploy - Vercel (3 minutes)
- [ ] Create account at https://vercel.com
- [ ] Import GitHub repository
- [ ] Framework: Vite (auto-detected)
- [ ] Add environment variable:
  - [ ] VITE_API_URL=https://your-backend.onrender.com/api
- [ ] Deploy and wait 2-3 minutes
- [ ] Copy frontend URL

## 🔧 Final Configuration (2 minutes)
- [ ] Update CORS_ORIGINS in Render to your Vercel URL
- [ ] Wait for Render redeploy (1-2 minutes)
- [ ] Test full application:
  - [ ] Frontend loads
  - [ ] Login works (admin@icca.com / admin123)
  - [ ] Templates page shows 22 templates
  - [ ] Email editor functions
  - [ ] Signup creates new account

## 🎯 Optional: Keep Awake (5 minutes)
- [ ] Create UptimeRobot account
- [ ] Add monitor for your backend health endpoint
- [ ] Set 5-minute interval
- [ ] Prevents cold starts

## 🎉 Success!
- [ ] Share your app URL with friends
- [ ] Add to portfolio/resume
- [ ] Consider custom domain (free on Vercel)

## 📊 Your Free Stack:
- Frontend: Vercel (Free forever)
- Backend: Render (Free tier)
- Database: Neon (Free 3GB)
- Monitoring: UptimeRobot (Free)
- SSL: Automatic on all platforms
- CDN: Global via Vercel

Total Monthly Cost: $0 🎉`;

fs.writeFileSync('FREE_DEPLOY_CHECKLIST.md', freeChecklist);
console.log('✅ Created step-by-step free deployment checklist');

// Create performance optimization for free tiers
const freeOptimizations = `// Add to server/server.js for free tier optimization

// Memory optimization for free tiers
if (process.env.NODE_ENV === 'production') {
  // Reduce memory usage
  process.env.NODE_OPTIONS = '--max-old-space-size=512';
  
  // Add caching headers for better performance
  app.use((req, res, next) => {
    // Cache static assets
    if (req.url.match(/\\.(css|js|png|jpg|jpeg|gif|ico|svg)$/)) {
      res.set('Cache-Control', 'public, max-age=86400'); // 24 hours
    } else {
      res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
    }
    next();
  });
  
  // Compress responses
  const compression = require('compression');
  app.use(compression());
  
  // Health check optimization
  app.get('/health', (req, res) => {
    res.status(200).json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      service: 'ICCA Backend API',
      memory: process.memoryUsage(),
      uptime: process.uptime()
    });
  });
}`;

fs.writeFileSync('FREE_TIER_OPTIMIZATIONS.js', freeOptimizations);
console.log('✅ Created free tier performance optimizations');

console.log('');
console.log('🎯 Free Deployment Ready!');
console.log('');
console.log('📚 Your Free Deployment Guides:');
console.log('   📖 FREE_DEPLOYMENT_GUIDE.md - Complete guide');
console.log('   ✅ FREE_DEPLOY_CHECKLIST.md - Step-by-step checklist');
console.log('   ⚡ UPTIME_SETUP.md - Keep your app awake');
console.log('   🔧 FREE_TIER_OPTIMIZATIONS.js - Performance tips');
console.log('');
console.log('🚀 Recommended Free Stack:');
console.log('   🎨 Frontend: Vercel (Free forever)');
console.log('   ⚙️  Backend: Render (Free tier)');
console.log('   🗄️  Database: Neon (Free 3GB)');
console.log('   📊 Monitoring: UptimeRobot (Free)');
console.log('');
console.log('💰 Total Monthly Cost: $0');
console.log('⏱️  Setup Time: 15-20 minutes');
console.log('🎯 Result: Professional web application');
console.log('');
console.log('🎉 Start with FREE_DEPLOY_CHECKLIST.md for fastest deployment!');
console.log('');
console.log('🔗 Free Platform Links:');
console.log('   • Neon Database: https://neon.tech');
console.log('   • Render Backend: https://render.com');
console.log('   • Vercel Frontend: https://vercel.com');
console.log('   • UptimeRobot: https://uptimerobot.com');
console.log('');
console.log('💡 Pro Tip: Follow the checklist step-by-step for guaranteed success!');

// Create a quick start script
const quickStart = `#!/bin/bash
# ICCA Free Deployment Quick Start

echo "🆓 ICCA Free Deployment Starting..."
echo ""

echo "📋 What you need:"
echo "   ✅ GitHub account (free)"
echo "   ✅ 20 minutes of time"
echo "   ✅ Email address for accounts"
echo ""

echo "🎯 Deployment order:"
echo "   1️⃣ Neon Database (5 min)"
echo "   2️⃣ Render Backend (8 min)"  
echo "   3️⃣ Vercel Frontend (3 min)"
echo "   4️⃣ Test & Configure (4 min)"
echo ""

echo "📖 Follow: FREE_DEPLOY_CHECKLIST.md"
echo "🚀 Result: Live app at https://your-app.vercel.app"
echo ""

echo "💰 Total cost: $0/month forever!"
echo "🎉 Let's make your app live!"`;

fs.writeFileSync('quick-start-free.sh', quickStart);
console.log('📄 Created quick-start-free.sh script');

console.log('');
console.log('🎯 Next Step: Open FREE_DEPLOY_CHECKLIST.md and start deploying!');
console.log('⚡ Your free ICCA app will be live in 20 minutes!');