# 🔧 Health Check Failure Fix

## 🎯 **Health Check Failure Causes**

Your backend deployment is failing health checks because:
1. **Database connection error** (most common)
2. **Missing environment variables**
3. **Port configuration issue**
4. **Dependencies not installed properly**

---

## 🚀 **Quick Fix Steps**

### **Step 1: Check Your Deployment Platform**

#### **If using Railway:**
1. **Go to**: Railway dashboard → Your project
2. **Click**: Backend service
3. **Check**: "Deployments" tab for error logs
4. **Look for**: Red error messages

#### **If using Render:**
1. **Go to**: Render dashboard → Your service
2. **Click**: "Logs" tab
3. **Look for**: Error messages in red

### **Step 2: Common Fixes**

#### **Fix 1: Database Connection (Most Common)**

**Problem**: No DATABASE_URL or wrong format

**Solution**:
1. **Create Neon database** if you haven't:
   - Go to https://neon.tech
   - Create project "icca-database"
   - Run schema from `server/database/schema.sql`
   - Copy connection string

2. **Add DATABASE_URL** to your deployment:
   ```bash
   DATABASE_URL=postgresql://username:password@host.neon.tech/database?sslmode=require
   ```

#### **Fix 2: Missing Environment Variables**

**Add these to your deployment platform**:
```bash
NODE_ENV=production
PORT=10000
DATABASE_URL=your-neon-connection-string
JWT_SECRET=icca-secure-jwt-secret-2024-change-this
CORS_ORIGINS=https://quiet-beijinho-a5ff63.netlify.app
```

#### **Fix 3: Port Configuration**

**Railway**: Uses PORT environment variable automatically
**Render**: Must be set to 10000

---

## ⚡ **Fastest Fix: Use Railway with Auto-Database**

### **Complete Railway Setup (5 minutes)**

1. **Go to**: https://railway.app
2. **New Project** → "Deploy from GitHub repo"
3. **Select**: Your ICCA repository
4. **Important**: Set root directory to `server`
5. **Add PostgreSQL service**:
   - Click "New" → "Database" → "PostgreSQL"
   - Railway auto-connects it
6. **Add environment variables**:
   ```bash
   NODE_ENV=production
   JWT_SECRET=icca-secure-jwt-secret-2024
   CORS_ORIGINS=https://quiet-beijinho-a5ff63.netlify.app
   ```
7. **Railway automatically provides DATABASE_URL**

### **Setup Database Schema**
1. **Click**: PostgreSQL service
2. **Connect** → "PostgreSQL CLI"
3. **Copy-paste**: Content from `server/database/schema.sql`
4. **Execute**: Should create 6 tables

---

## 🔍 **Debug Your Current Deployment**

### **Check Logs for Specific Errors**

#### **Common Error Messages & Fixes**:

**"ECONNREFUSED" or "connection refused"**
- **Problem**: Database not accessible
- **Fix**: Add correct DATABASE_URL

**"Cannot find module"**
- **Problem**: Dependencies not installed
- **Fix**: Ensure `npm install` runs in build

**"Port already in use" or "EADDRINUSE"**
- **Problem**: Port configuration
- **Fix**: Set PORT=10000 in environment

**"JWT_SECRET is required"**
- **Problem**: Missing JWT secret
- **Fix**: Add JWT_SECRET environment variable

**"CORS error"**
- **Problem**: CORS not configured
- **Fix**: Add CORS_ORIGINS with your Netlify URL

---

## 📋 **Step-by-Step Troubleshooting**

### **Step 1: Verify Environment Variables**
Check your deployment has ALL of these:
- [ ] `NODE_ENV=production`
- [ ] `PORT=10000` (Render) or auto (Railway)
- [ ] `DATABASE_URL=postgresql://...`
- [ ] `JWT_SECRET=some-secure-string`
- [ ] `CORS_ORIGINS=https://quiet-beijinho-a5ff63.netlify.app`

### **Step 2: Check Database Connection**
Your DATABASE_URL should look like:
```
postgresql://username:password@host.neon.tech/database?sslmode=require
```

### **Step 3: Verify Build Settings**
- **Root Directory**: `server` (not project root)
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### **Step 4: Check Package.json**
Your `server/package.json` should have:
```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

---

## 🛠️ **Alternative: Manual Render Setup**

If Railway isn't working, try Render with manual database:

### **Step 1: Create Neon Database**
1. **Go to**: https://neon.tech
2. **Create project**: "icca-database"
3. **SQL Editor**: Run your schema
4. **Copy**: Connection string

### **Step 2: Deploy to Render**
1. **Go to**: https://render.com
2. **New Web Service** from GitHub
3. **Configure**:
   ```
   Name: icca-backend
   Root Directory: server
   Build Command: npm install
   Start Command: npm start
   ```
4. **Add environment variables** (including DATABASE_URL from Step 1)

---

## 🧪 **Test Your Fix**

### **Health Check Test**
Once deployed, test:
```
https://your-backend-url.railway.app/health
```
Should return:
```json
{"status":"OK","timestamp":"...","service":"ICCA Backend API"}
```

### **API Test**
```
https://your-backend-url.railway.app/api/templates
```
Should return list of templates.

---

## 🆘 **If Still Failing**

### **Get Specific Error**
1. **Check deployment logs** for exact error message
2. **Look for**:
   - Database connection errors
   - Missing environment variables
   - Port binding issues
   - Module not found errors

### **Share Error Details**
Tell me:
1. **Which platform** you're using (Railway/Render)
2. **Exact error message** from logs
3. **Environment variables** you've set

I can give you the specific fix!

---

## 💡 **Most Common Solution**

**90% of health check failures** are due to:
1. **Missing DATABASE_URL**
2. **Wrong root directory** (should be `server`)
3. **Database not created/schema not run**

**Quick fix**: Use Railway with auto-PostgreSQL - it handles most of these automatically.

---

## 🎯 **Recommended Action**

1. **Try Railway** with auto-database (simplest)
2. **If that fails**: Share the specific error message
3. **I'll give you** the exact fix for your error

**Your app is almost there - just need to get the backend health check passing!** 🚀