# 🚂 Railway Healthcheck Fix

## 🎯 **Railway Healthcheck Failed - Solutions**

The error "1/1 replicas never became healthy! Healthcheck failed!" means your backend is starting but crashing before Railway can verify it's working.

---

## 🔍 **Step 1: Check Railway Logs**

1. **Go to**: Railway dashboard → Your project
2. **Click**: Your backend service
3. **Click**: "Deployments" tab
4. **Click**: Latest deployment (the failed one)
5. **Scroll down**: Look for detailed error logs
6. **Look for**: Specific error messages in red

### **Common Error Messages & Fixes:**

#### **"Error: Cannot find module 'pg'"**
**Fix**: Dependencies not installed properly
```bash
# In Railway, check Build Logs
# Should see "npm install" running successfully
```

#### **"ECONNREFUSED" or "connect ECONNREFUSED"**
**Fix**: Database connection issue
```bash
# Check DATABASE_URL format is correct
```

#### **"Error: listen EADDRINUSE"**
**Fix**: Port configuration issue
```bash
# Railway handles PORT automatically - don't set PORT variable
```

#### **"Cannot read properties of undefined"**
**Fix**: Environment variables not loading
```bash
# Check .env file or environment variables
```

---

## ⚡ **Quick Fix: Correct Railway Configuration**

### **Step 1: Check Service Settings**

1. **Go to**: Railway → Your service → Settings
2. **Verify**:
   - **Root Directory**: `server`
   - **Start Command**: `npm start` (or leave empty for auto-detect)
   - **Build Command**: Leave empty (Railway auto-detects)

### **Step 2: Environment Variables**

**Remove PORT variable** if you have it (Railway sets this automatically)

**Keep only these variables**:
```bash
NODE_ENV=production
DATABASE_URL=postgresql://neondb_owner:npg_7gOSZ0desNAz@ep-dawn-lab-adocbyur-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=icca-secure-jwt-secret-2024-change-this
CORS_ORIGINS=https://quiet-beijinho-a5ff63.netlify.app
```

### **Step 3: Check package.json**

Ensure `server/package.json` has:
```json
{
  "name": "icca-backend",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.3",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2"
  }
}
```

---

## 🛠️ **Alternative Fix: Simplified Railway Setup**

### **Option 1: Fresh Railway Deployment**

1. **Delete** current Railway service
2. **Create new service**:
   - **Deploy from GitHub repo**
   - **Select** your repository
   - **Set root directory**: `server`
   - **Don't add any environment variables yet**
3. **Let it deploy** with minimal config
4. **Check logs** - should at least start without database
5. **Add environment variables** one by one

### **Option 2: Use Railway PostgreSQL**

Instead of external Neon database:

1. **In Railway project**: Click "New" → "Database" → "PostgreSQL"
2. **Railway creates** PostgreSQL automatically
3. **Connect to Railway DB**: Click "Connect" → "PostgreSQL CLI"
4. **Run your schema**: Copy-paste from `server/database/schema.sql`
5. **Railway provides** DATABASE_URL automatically
6. **Remove** external DATABASE_URL from environment variables

---

## 🔧 **Debug Your Current Setup**

### **Check These Common Issues:**

#### **1. File Structure**
Ensure your repository has:
```
your-repo/
├── server/
│   ├── server.js
│   ├── package.json
│   └── database/
│       └── schema.sql
├── src/
└── package.json (frontend)
```

#### **2. Server.js Port Configuration**
Your `server/server.js` should use Railway's PORT:
```javascript
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

#### **3. Database Connection**
Check if database connection is properly handled:
```javascript
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('neon.tech') ? { rejectUnauthorized: false } : false
});
```

---

## 🧪 **Test Database Connection First**

### **Verify Neon Database Works**

1. **Go to**: https://console.neon.tech
2. **SQL Editor**: Run this test:
```sql
SELECT 'Database is working!' as message, NOW() as timestamp;
```
3. **Should return**: Success message
4. **If fails**: Database issue, not Railway issue

---

## 🚀 **Recommended Solution: Start Fresh**

### **Clean Railway Setup (10 minutes)**

1. **Delete** current Railway service
2. **Create new Railway project**
3. **Add PostgreSQL service** (Railway managed)
4. **Deploy backend** with Railway database
5. **Test step by step**

#### **Step-by-Step:**

1. **Railway Dashboard** → "New Project"
2. **Deploy from GitHub repo** → Select your repo
3. **Add PostgreSQL**: Click "New" → "Database" → "PostgreSQL"
4. **Configure backend service**:
   - Root directory: `server`
   - Let Railway auto-detect everything else
5. **Add minimal environment variables**:
```bash
NODE_ENV=production
JWT_SECRET=icca-secure-jwt-2024
CORS_ORIGINS=https://quiet-beijinho-a5ff63.netlify.app
```
6. **Deploy and check logs**
7. **Setup database schema** in Railway PostgreSQL
8. **Test health endpoint**

---

## 🆘 **Get Specific Error**

### **To help you immediately, I need:**

1. **Go to**: Railway → Your service → Deployments → Latest deployment
2. **Scroll down**: To deployment logs
3. **Copy**: Any red error messages
4. **Share**: The exact error text

### **Common Railway Log Locations:**
- **Build Logs**: Shows npm install issues
- **Deploy Logs**: Shows startup errors
- **Runtime Logs**: Shows application errors

---

## 💡 **Quick Diagnostic Commands**

### **Add these to your server.js for debugging:**

```javascript
// Add at the top of server.js
console.log('🚀 Starting ICCA Backend...');
console.log('📊 Environment:', process.env.NODE_ENV);
console.log('🔌 Port:', process.env.PORT);
console.log('🗄️ Database URL exists:', !!process.env.DATABASE_URL);

// Add before app.listen()
console.log('✅ Server setup complete, starting listener...');
```

This will show in Railway logs what's happening during startup.

---

## 🎯 **Most Likely Solutions**

### **90% of Railway healthcheck failures:**

1. **Wrong root directory** (should be `server`)
2. **Missing dependencies** in package.json
3. **Database connection string** issues
4. **Port configuration** conflicts

### **Try this order:**
1. **Fix root directory** to `server`
2. **Remove PORT** environment variable
3. **Use Railway PostgreSQL** instead of external
4. **Check deployment logs** for specific errors

**What specific error message do you see in the Railway deployment logs?** 

**Share the exact error and I'll give you the immediate fix!** 🚀