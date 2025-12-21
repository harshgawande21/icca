const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_7gOSZ0desNAz@ep-dawn-lab-adocbyur-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: { rejectUnauthorized: false }
});

async function checkAdmin() {
  try {
    console.log('🔍 Checking admin user...');
    
    // Get admin user
    const result = await pool.query('SELECT email, password_hash FROM users WHERE email = $1', ['admin@icca.com']);
    
    if (result.rows.length === 0) {
      console.log('❌ Admin user not found');
      return;
    }
    
    const user = result.rows[0];
    console.log('✅ Admin user found:', user.email);
    
    // Test password
    const testPassword = 'admin123';
    const isValid = await bcrypt.compare(testPassword, user.password_hash);
    
    console.log('🔑 Password test result:', isValid ? '✅ VALID' : '❌ INVALID');
    
    if (!isValid) {
      console.log('🔧 Creating new password hash...');
      const newHash = await bcrypt.hash(testPassword, 12);
      
      await pool.query('UPDATE users SET password_hash = $1 WHERE email = $2', [newHash, 'admin@icca.com']);
      
      console.log('✅ Password updated successfully!');
      console.log('🔑 Try logging in with: admin@icca.com / admin123');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkAdmin();