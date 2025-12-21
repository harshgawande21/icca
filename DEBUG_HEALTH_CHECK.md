# 🔍 Debug Health Check Failure

## 🎯 **Get Specific Error Message**

### **Step 1: Check Deployment Logs**

#### **If using Railway:**
1. **Go to**: Railway dashboard → Your project
2. **Click**: Your backend service
3. **Click**: "Deployments" tab
4. **Click**: Latest deployment
5. **Scroll down**: Look for red error messages
6. **Copy**: The exact error text

#### **If using Render:**
1. **Go to**: Render dashboard → Your service
2. **Click**: "Logs" tab
3. **Look for**: Red error messages
4. **Copy**: The exact error text

### **Step 2: Common Health Check Errors & Fixes**

#### **Error: "ECONNREFUSED" or "connection refused"**
**Problem**: Can't connect to database
**Fix**: Check DATABASE_URL format
```bash
# Correct format:
DATABASE_URL=postgresql://neondb_owner:npg_7gOSZ0desNAz@ep-dawn-lab-adocbyur-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

#### **Error: "Cannot find module 'pg'"**
**Problem**: Dependencies not installed
**Fix**: Ensure build command is `npm install`

#### **Error: "Port 3001 is already in use"**
**Problem**: Wrong port configuration
**Fix**: Set PORT environment variable
```bash
PORT=10000  # For Render
# Railway handles PORT automatically
```

#### **Error: "JWT_SECRET is required"**
**Problem**: Missing JWT secret
**Fix**: Add JWT_SECRET environment variable
```bash
JWT_SECRET=icca-secure-jwt-secret-2024-change-this
```

#### **Error: "Cannot read properties of undefined"**
**Problem**: Environment variables not loaded
**Fix**: Check .env file loading in server.js

---

## ⚡ **Quick Fix: Simplified Deployment**

### **Try This Minimal Setup**

#### **Step 1: Create Simple Test Backend**
Create a minimal version to test:

1. **Go to**: Your deployment platform
2. **Set environment variables** to ONLY these:
```bash
NODE_ENV=production
DATABASE_URL=postgresql://neondb_owner:npg_7gOSZ0desNAz@ep-dawn-lab-adocbyur-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

3. **Deploy** with minimal config
4. **Check logs** for specific error

#### **Step 2: Test Database Connection Separately**
Test if your database is accessible:

1. **Go to**: https://console.neon.tech
2. **SQL Editor**: Run this test query:
```sql
SELECT NOW();
```
3. **Should return**: Current timestamp
4. **If fails**: Database issue
5. **If works**: Backend code issue

---

## 🛠️ **Alternative: Use Render with Manual Setup**

### **Step 1: Create Render Service**
1. **Go to**: https://render.com
2. **New Web Service** → Connect GitHub
3. **Configure**:
```
Name: icca-backend
Root Directory: server
Runtime: Node
Build Command: npm install
Start Command: npm start
```

### **Step 2: Add Environment Variables ONE BY ONE**
Add them individually to isolate issues:

1. **First, add only**:
```bash
NODE_ENV=production
PORT=10000
```

2. **Deploy and check logs**

3. **If successful, add**:
```bash
DATABASE_URL=postgresql://neondb_owner:npg_7gOSZ0desNAz@ep-dawn-lab-adocbyur-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

4. **Deploy and check logs**

5. **Continue adding variables one by one**

---

## 🔧 **Check Your server.js File**

### **Verify Health Endpoint Exists**
Your `server/server.js` should have:

```javascript
// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'ICCA Backend API'
  });
});
```

### **Check Database Connection**
Ensure database connection is properly handled:

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err);
});
```

---

## 🧪 **Debug Steps**

### **Step 1: Check Package.json**
Verify `server/package.json` has:
```json
{
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.3",
    "dotenv": "^16.3.1"
  }
}
```

### **Step 2: Check File Structure**
Ensure you have:
```
server/
├── server.js
├── package.json
├── database/
│   └── connection.js
└── routes/
    └── (your route files)
```

### **Step 3: Test Locally First**
Before deploying, test locally:
```bash
cd server
npm install
DATABASE_URL="your-neon-url" npm start
```

---

## 🆘 **Get Immediate Help**

### **Share These Details:**
1. **Platform**: Railway, Render, or other?
2. **Exact error message**: From deployment logs
3. **Environment variables**: List what you've set (hide sensitive values)
4. **File structure**: Is server.js in the server/ folder?

### **Quick Test Commands**
Try these in your deployment logs:

```bash
# Check if files exist
ls -la

# Check if dependencies installed
npm list

# Check environment variables
echo $DATABASE_URL
echo $NODE_ENV
```

---

## 💡 **Most Common Solutions**

### **90% of health check failures are:**
1. **Wrong root directory** (should be `server`)
2. **Missing dependencies** (npm install not running)
3. **Database connection string** format issues
4. **Missing environment variables**

### **Quick Fix Checklist:**
- [ ] Root directory set to `server`
- [ ] Build command is `npm install`
- [ ] Start command is `npm start`
- [ ] DATABASE_URL is exactly as provided
- [ ] All required dependencies in package.json

---

## 🎯 **Next Steps**

1. **Check deployment logs** for exact error
2. **Share the error message** with me
3. **I'll give you** the specific fix
4. **Test step by step** to isolate the issue

**What specific error message do you see in the deployment logs?** 🔍

**Copy and paste the exact error, and I'll give you the immediate fix!** 🚀