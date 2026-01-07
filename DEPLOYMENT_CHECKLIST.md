# ✅ ICCA Free Deployment Checklist

## 🎯 Quick Start (5 Minutes Setup)

### ✅ Prerequisites (Already Done)
- [x] GitHub repository: https://github.com/harshgawande21/icca
- [x] Database: Neon PostgreSQL configured
- [x] Email service: Resend API key configured
- [x] Backend code: Ready for deployment

---

## 🖥️ Step 1: Deploy Backend to Render (2 minutes)

### 1.1 Go to Render
1. Visit: https://render.com
2. Click "Get Started for Free"
3. Sign up with GitHub

### 1.2 Create Web Service
1. Click "New +" → "Web Service"
2. Connect GitHub repository: `harshgawande21/icca`
3. Configure:
   - **Name**: `icca-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && node server.js`
   - **Instance Type**: Free

### 1.3 Add Environment Variables
In Render dashboard, add these environment variables:

```
DATABASE_URL=postgresql://neondb_owner:npg_7gOSZ0desNAz@ep-dawn-lab-adocbyur-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

RESEND_API_KEY=re_8oNk18Td_GMMu1tieZAz12zGsdonitHPz

NODE_ENV=production

CORS_ORIGINS=https://icca-frontend.vercel.app,http://localhost:5173
```

### 1.4 Deploy
1. Click "Create Web Service"
2. Wait 2-3 minutes for deployment
3. Your backend URL: `https://icca-backend.onrender.com`

---

## 🌐 Step 2: Deploy Frontend to Vercel (2 minutes)

### 2.1 Go to Vercel
1. Visit: https://vercel.com
2. Click "Start Deploying"
3. Sign up with GitHub

### 2.2 Import Project
1. Click "Add New..." → "Project"
2. Import from GitHub: `harshgawande21/icca`
3. Vercel auto-detects Vite configuration ✅

### 2.3 Configure Environment Variables
In Vercel dashboard, add:
```
VITE_API_URL=https://icca-backend.onrender.com/api
```

### 2.4 Deploy
1. Click "Deploy"
2. Wait 1-2 minutes
3. Your frontend URL: `https://icca-frontend.vercel.app`

---

## 🧪 Step 3: Test Everything (1 minute)

### 3.1 Test Backend Health
Visit: `https://icca-backend.onrender.com/health`
Should show: `{"status":"OK",...}`

### 3.2 Test Frontend
Visit: `https://icca-frontend.vercel.app`
Should load ICCA interface

### 3.3 Test Email Sending
1. Open ICCA frontend
2. Fill email form:
   - **To**: your-email@gmail.com
   - **Subject**: Test Email
   - **Message**: Hello from ICCA!
3. Click "Send Email"
4. Check your inbox ✅

---

## 🎉 Success! Your ICCA is Live

### 📊 Your Free Stack
- ✅ **Frontend**: Vercel (100GB bandwidth/month)
- ✅ **Backend**: Render (750 hours/month)  
- ✅ **Database**: Neon (512MB storage)
- ✅ **Email**: Resend (3000 emails/month)
- 💰 **Cost**: ₹0/month

### 🔗 Your Live URLs
- **App**: https://icca-frontend.vercel.app
- **API**: https://icca-backend.onrender.com
- **Health**: https://icca-backend.onrender.com/health

---

## 🚨 Troubleshooting

### Problem: "Cannot connect to backend"
**Solution**: 
1. Check backend is deployed: visit health URL
2. Verify CORS_ORIGINS includes your Vercel domain
3. Wait 30 seconds (Render cold start)

### Problem: "Email not sending"
**Solution**:
1. Check Resend API key is set correctly
2. Verify email format is valid
3. Check browser console for errors

### Problem: "Build failed"
**Solution**:
1. Ensure package.json has `"build": "vite build"`
2. Check all dependencies are in package.json
3. Verify Node.js version compatibility

---

## 🔄 Updates & Maintenance

### To Update Your App:
1. Push changes to GitHub
2. Vercel auto-deploys frontend ✅
3. Render auto-deploys backend ✅

### Free Tier Monitoring:
- Render: 750 hours/month (always-on)
- Vercel: 100GB bandwidth/month
- Neon: 512MB storage
- Resend: 3000 emails/month

**Perfect for portfolio, demos, and learning! 🎯**