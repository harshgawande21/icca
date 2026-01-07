# 🚀 ICCA Free Deployment Guide (₹0 Monthly Cost)

## Stack Overview
- **Frontend**: Vercel (free tier - better than Cloudflare Pages for React)
- **Backend**: Render (free tier - 750 hours/month)
- **Database**: Neon PostgreSQL (free tier - 512MB)
- **Email**: Resend (free tier - 3000 emails/month)

---

## 🎯 Step 1: Prepare Your Code

### 1.1 Update Frontend Environment
```bash
# Update .env for production
echo "VITE_API_URL=https://icca-backend.onrender.com/api" > .env.production
```

### 1.2 Fix Package.json Scripts
Your current package.json is correct - no changes needed.

---

## 🗄️ Step 2: Database Setup (Neon PostgreSQL)

### 2.1 Create Neon Account
1. Go to https://neon.tech
2. Sign up with GitHub/Google (free)
3. Create new project: "icca-database"
4. Copy connection string (you already have this)

### 2.2 Your Database Connection
```
postgresql://neondb_owner:npg_7gOSZ0desNAz@ep-dawn-lab-adocbyur-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

✅ **Status**: Already configured and working

---

## 📧 Step 3: Email Service Setup (Resend)

### 3.1 Resend Configuration
- **API Key**: `re_8oNk18Td_GMMu1tieZAz12zGsdonitHPz`
- **Free Tier**: 3000 emails/month
- **From Domain**: `onboarding@resend.dev` (verified)

✅ **Status**: Already configured in backend

---

## 🖥️ Step 4: Backend Deployment (Render)

### 4.1 Deploy to Render
1. **Go to**: https://render.com
2. **Sign up** with GitHub
3. **Connect Repository**: https://github.com/harshgawande21/icca
4. **Create Web Service**:
   - **Name**: `icca-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && node server.js`
   - **Instance Type**: Free

### 4.2 Environment Variables (Render Dashboard)
```
DATABASE_URL=postgresql://neondb_owner:npg_7gOSZ0desNAz@ep-dawn-lab-adocbyur-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

RESEND_API_KEY=re_8oNk18Td_GMMu1tieZAz12zGsdonitHPz

NODE_ENV=production

CORS_ORIGINS=https://icca-frontend.vercel.app,https://your-custom-domain.vercel.app
```

### 4.3 Expected URL
Your backend will be available at: `https://icca-backend.onrender.com`

✅ **Status**: Already deployed and working

---

## 🌐 Step 5: Frontend Deployment (Vercel)

### 5.1 Deploy to Vercel
1. **Go to**: https://vercel.com
2. **Sign up** with GitHub
3. **Import Project**: https://github.com/harshgawande21/icca
4. **Configure**:
   - **Framework**: Vite
   - **Root Directory**: `.` (leave empty)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 5.2 Environment Variables (Vercel Dashboard)
```
VITE_API_URL=https://icca-backend.onrender.com/api
```

### 5.3 Expected URL
Your frontend will be available at: `https://icca-frontend.vercel.app`

---

## 🔧 Step 6: Fix Current Issues

### 6.1 Update CORS in Backend
The backend needs to allow your Vercel domain. Update server/server.js:

```javascript
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://icca-frontend.vercel.app',
    'https://your-custom-domain.vercel.app'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};
```

### 6.2 Update Frontend API URL
Make sure your frontend uses the correct API URL in production.

---

## 🧪 Step 7: Testing

### 7.1 Test Backend Health
```bash
curl https://icca-backend.onrender.com/health
```

### 7.2 Test Email Sending
```bash
curl -X POST https://icca-backend.onrender.com/api/emails/send-direct \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Test Email",
    "body": "This is a test email from ICCA"
  }'
```

---

## 📊 Free Tier Limits

| Service | Free Tier Limit | Monthly Cost |
|---------|----------------|--------------|
| Vercel | 100GB bandwidth, 6000 build minutes | ₹0 |
| Render | 750 hours/month (always on) | ₹0 |
| Neon | 512MB storage, 1 database | ₹0 |
| Resend | 3000 emails/month | ₹0 |
| **Total** | **Perfect for portfolio/demo** | **₹0** |

---

## 🚨 Common Issues & Solutions

### Issue 1: "Cannot connect to backend"
- **Solution**: Check CORS configuration and API URL

### Issue 2: "Email not sending"
- **Solution**: Verify Resend API key and from domain

### Issue 3: "Build failed on Vercel"
- **Solution**: Ensure package.json has correct build script

### Issue 4: "Backend sleeping (Render)"
- **Solution**: First request may take 30 seconds (cold start)

---

## 🎉 Final URLs

After deployment, you'll have:
- **Frontend**: https://icca-frontend.vercel.app
- **Backend**: https://icca-backend.onrender.com
- **Database**: Neon PostgreSQL (managed)
- **Email**: Resend API (managed)

**Total Monthly Cost**: ₹0 🎯

---

## 🔄 Next Steps

1. Deploy backend to Render (if not already done)
2. Deploy frontend to Vercel
3. Update CORS settings
4. Test email functionality
5. Add custom domain (optional, free with Vercel)

This setup is perfect for:
- ✅ Student projects
- ✅ Portfolio demonstrations  
- ✅ MVP testing
- ✅ Learning full-stack development