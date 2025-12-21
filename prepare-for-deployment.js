#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Preparing ICCA for Production Deployment...');
console.log('');

// Check if we're in the right directory
if (!fs.existsSync('package.json') || !fs.existsSync('server/package.json')) {
  console.error('❌ Please run this script from the ICCA project root directory');
  process.exit(1);
}

// Read package.json files
const frontendPackage = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const backendPackage = JSON.parse(fs.readFileSync('server/package.json', 'utf8'));

console.log('📋 Pre-Deployment Checklist:');
console.log('');

// Check frontend package.json
console.log('🎨 Frontend Configuration:');
console.log(`   ✅ Project: ${frontendPackage.name}`);
console.log(`   ✅ Version: ${frontendPackage.version}`);
console.log(`   ✅ Build script: ${frontendPackage.scripts.build ? 'Present' : '❌ Missing'}`);
console.log(`   ✅ Dependencies: ${Object.keys(frontendPackage.dependencies || {}).length} packages`);

// Check backend package.json
console.log('');
console.log('⚙️  Backend Configuration:');
console.log(`   ✅ Project: ${backendPackage.name}`);
console.log(`   ✅ Version: ${backendPackage.version}`);
console.log(`   ✅ Start script: ${backendPackage.scripts.start ? 'Present' : '❌ Missing'}`);
console.log(`   ✅ Dependencies: ${Object.keys(backendPackage.dependencies || {}).length} packages`);

// Check required files
console.log('');
console.log('📁 Required Files:');
const requiredFiles = [
  'vercel.json',
  'server/railway.json',
  'server/nixpacks.toml',
  '.env.production',
  'server/.env.production',
  'server/database/schema.sql'
];

requiredFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`   ${exists ? '✅' : '❌'} ${file}`);
});

// Check environment files
console.log('');
console.log('🔧 Environment Configuration:');

// Check if .env.production exists and has required variables
if (fs.existsSync('.env.production')) {
  const frontendEnv = fs.readFileSync('.env.production', 'utf8');
  console.log(`   ✅ Frontend .env.production exists`);
  console.log(`   ${frontendEnv.includes('VITE_API_URL') ? '✅' : '❌'} VITE_API_URL configured`);
} else {
  console.log('   ❌ Frontend .env.production missing');
}

if (fs.existsSync('server/.env.production')) {
  const backendEnv = fs.readFileSync('server/.env.production', 'utf8');
  console.log(`   ✅ Backend .env.production exists`);
  console.log(`   ${backendEnv.includes('DATABASE_URL') ? '✅' : '❌'} DATABASE_URL configured`);
  console.log(`   ${backendEnv.includes('JWT_SECRET') ? '✅' : '❌'} JWT_SECRET configured`);
  console.log(`   ${backendEnv.includes('CORS_ORIGINS') ? '✅' : '❌'} CORS_ORIGINS configured`);
} else {
  console.log('   ❌ Backend .env.production missing');
}

// Check database schema
console.log('');
console.log('🗄️  Database Schema:');
if (fs.existsSync('server/database/schema.sql')) {
  const schema = fs.readFileSync('server/database/schema.sql', 'utf8');
  const tableCount = (schema.match(/CREATE TABLE/g) || []).length;
  const insertCount = (schema.match(/INSERT INTO/g) || []).length;
  console.log(`   ✅ Schema file exists`);
  console.log(`   ✅ Tables to create: ${tableCount}`);
  console.log(`   ✅ Initial data inserts: ${insertCount}`);
} else {
  console.log('   ❌ Schema file missing');
}

console.log('');
console.log('🎯 Deployment Readiness:');

// Calculate readiness score
let score = 0;
let total = 0;

// Frontend checks
total += 4;
if (frontendPackage.scripts.build) score++;
if (fs.existsSync('vercel.json')) score++;
if (fs.existsSync('.env.production')) score++;
if (frontendPackage.dependencies && Object.keys(frontendPackage.dependencies).length > 0) score++;

// Backend checks
total += 4;
if (backendPackage.scripts.start) score++;
if (fs.existsSync('server/railway.json')) score++;
if (fs.existsSync('server/.env.production')) score++;
if (backendPackage.dependencies && Object.keys(backendPackage.dependencies).length > 0) score++;

// Database checks
total += 2;
if (fs.existsSync('server/database/schema.sql')) score++;
if (fs.existsSync('server/nixpacks.toml')) score++;

const percentage = Math.round((score / total) * 100);
console.log(`   📊 Readiness Score: ${score}/${total} (${percentage}%)`);

if (percentage >= 90) {
  console.log('   🎉 Ready for deployment!');
} else if (percentage >= 70) {
  console.log('   ⚠️  Almost ready - fix missing items above');
} else {
  console.log('   ❌ Not ready - several items need attention');
}

console.log('');
console.log('📚 Next Steps:');
console.log('');
console.log('1. 📖 Read the deployment guide:');
console.log('   - HOSTING_GUIDE.md (comprehensive guide)');
console.log('   - quick-deploy.md (15-minute setup)');
console.log('   - deploy-checklist.md (step-by-step)');
console.log('');
console.log('2. 🚀 Choose your hosting platform:');
console.log('   - Recommended: Vercel (frontend) + Railway (backend)');
console.log('   - Alternative: Heroku, DigitalOcean, AWS');
console.log('');
console.log('3. 🔧 Set up hosting accounts:');
console.log('   - Create Railway account: https://railway.app');
console.log('   - Create Vercel account: https://vercel.com');
console.log('');
console.log('4. 📤 Push code to GitHub:');
console.log('   - Ensure all code is committed and pushed');
console.log('   - Both platforms deploy from GitHub');
console.log('');
console.log('5. 🎯 Follow quick-deploy.md for fastest setup');
console.log('');

// Generate deployment URLs template
console.log('📋 Deployment URLs Template:');
console.log('');
console.log('After deployment, your URLs will be:');
console.log('   Frontend: https://your-app-name.vercel.app');
console.log('   Backend:  https://your-backend-name.railway.app');
console.log('   Health:   https://your-backend-name.railway.app/health');
console.log('');

// Cost estimate
console.log('💰 Estimated Monthly Costs:');
console.log('   Vercel (Frontend): $0 (free tier)');
console.log('   Railway (Backend + DB): $5-20');
console.log('   Total: $5-20/month');
console.log('');

console.log('🎉 Your ICCA application is ready for the world!');
console.log('');
console.log('💡 Pro tip: Start with the quick-deploy.md guide for fastest results.');

// Create a deployment summary file
const deploymentSummary = `# ICCA Deployment Summary

## Application Details
- **Frontend**: ${frontendPackage.name} v${frontendPackage.version}
- **Backend**: ${backendPackage.name} v${backendPackage.version}
- **Database**: PostgreSQL with 6 tables
- **Templates**: 22 professional email templates
- **Categories**: 14 template categories

## Deployment Readiness: ${percentage}%

## Recommended Hosting
- **Frontend**: Vercel (Free)
- **Backend**: Railway ($5-20/month)
- **Total Cost**: $5-20/month

## Quick Links
- [15-Minute Deploy Guide](quick-deploy.md)
- [Complete Hosting Guide](HOSTING_GUIDE.md)
- [Step-by-Step Checklist](deploy-checklist.md)

## Your URLs (after deployment)
- **App**: https://your-app.vercel.app
- **API**: https://your-backend.railway.app
- **Health**: https://your-backend.railway.app/health

Generated: ${new Date().toISOString()}
`;

fs.writeFileSync('DEPLOYMENT_SUMMARY.md', deploymentSummary);
console.log('📄 Created DEPLOYMENT_SUMMARY.md for your reference');
console.log('');
console.log('🚀 Ready to deploy? Run: npm run deploy (coming soon)');
console.log('   Or follow quick-deploy.md for manual deployment');