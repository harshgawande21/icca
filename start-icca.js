#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting ICCA - Intelligent Client Communication Assistant');
console.log('');

// Function to run command and show output
function runCommand(command, args, cwd, label) {
  return new Promise((resolve, reject) => {
    console.log(`📋 ${label}...`);
    
    const process = spawn(command, args, {
      cwd: cwd || __dirname,
      stdio: 'pipe',
      shell: true
    });

    let output = '';
    
    process.stdout.on('data', (data) => {
      output += data.toString();
    });

    process.stderr.on('data', (data) => {
      output += data.toString();
    });

    process.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ ${label} completed`);
        resolve(output);
      } else {
        console.log(`❌ ${label} failed`);
        console.log(output);
        reject(new Error(`${label} failed with code ${code}`));
      }
    });
  });
}

async function startICCA() {
  try {
    // Step 1: Install dependencies
    console.log('📦 Installing dependencies...');
    await runCommand('npm', ['install'], __dirname, 'Frontend dependencies');
    await runCommand('npm', ['install'], path.join(__dirname, 'server'), 'Backend dependencies');
    
    // Step 2: Setup database
    console.log('');
    console.log('🗄️ Setting up Neon database...');
    await runCommand('npm', ['run', 'setup-db'], path.join(__dirname, 'server'), 'Database setup');
    
    // Step 3: Test database connection
    console.log('');
    console.log('🔍 Testing database connection...');
    await runCommand('npm', ['run', 'test-db'], path.join(__dirname, 'server'), 'Database connection test');
    
    console.log('');
    console.log('🎉 ICCA setup completed successfully!');
    console.log('');
    console.log('📋 Next steps:');
    console.log('   1. Start backend:  cd server && npm run dev');
    console.log('   2. Start frontend: npm run dev');
    console.log('   3. Open browser:   http://localhost:5173');
    console.log('');
    console.log('💡 Or use: npm run dev:full (to start both simultaneously)');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log('');
    console.log('🔧 Manual setup:');
    console.log('   1. cd server && npm install');
    console.log('   2. npm run setup-db');
    console.log('   3. npm run dev');
    console.log('   4. In new terminal: npm install && npm run dev');
    process.exit(1);
  }
}

// Check if this script is being run directly
if (require.main === module) {
  startICCA();
}

module.exports = { startICCA };