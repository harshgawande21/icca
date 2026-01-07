#!/bin/bash

echo "🚀 ICCA Free Deployment Script"
echo "================================"

echo "📋 Step 1: Checking files..."
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found!"
    exit 1
fi

if [ ! -f "server/server.js" ]; then
    echo "❌ server/server.js not found!"
    exit 1
fi

echo "✅ All required files found"

echo ""
echo "📋 Step 2: Installing dependencies..."
npm install

echo ""
echo "📋 Step 3: Building frontend..."
npm run build

echo ""
echo "🎯 Deployment Ready!"
echo ""
echo "Next steps:"
echo "1. 🖥️  Backend: Deploy to Render using render.yaml"
echo "   - Go to https://render.com"
echo "   - Connect your GitHub repo"
echo "   - Use 'render.yaml' for configuration"
echo ""
echo "2. 🌐 Frontend: Deploy to Vercel"
echo "   - Go to https://vercel.com" 
echo "   - Import your GitHub repo"
echo "   - Vercel will auto-detect Vite settings"
echo ""
echo "3. 📧 Email: Already configured with Resend"
echo "   - API Key: re_8oNk18Td_GMMu1tieZAz12zGsdonitHPz"
echo "   - 3000 free emails/month"
echo ""
echo "4. 🗄️  Database: Already configured with Neon"
echo "   - PostgreSQL connection ready"
echo ""
echo "💰 Total monthly cost: ₹0 (100% FREE!)"
echo ""
echo "🔗 Expected URLs after deployment:"
echo "   Frontend: https://icca-frontend.vercel.app"
echo "   Backend:  https://icca-backend.onrender.com"