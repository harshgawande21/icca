# 🆓 Free Deployment Checklist

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

Total Monthly Cost: $0 🎉