const { query } = require('./database/connection');
const bcrypt = require('bcryptjs');

async function fixAdminPassword() {
  console.log('🔧 Fixing admin user password...');
  
  try {
    // Generate correct hash for 'admin123'
    const password = 'admin123';
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    console.log('📝 Generated password hash for:', password);
    
    // Update the admin user's password
    const result = await query(`
      UPDATE users 
      SET password_hash = $1 
      WHERE email = 'admin@icca.com'
      RETURNING email, first_name, last_name
    `, [passwordHash]);
    
    if (result.rows.length > 0) {
      console.log('✅ Admin password updated successfully!');
      console.log('👤 User:', result.rows[0].first_name, result.rows[0].last_name);
      console.log('📧 Email:', result.rows[0].email);
      console.log('🔑 Password: admin123');
    } else {
      console.log('❌ Admin user not found');
    }
    
  } catch (error) {
    console.error('❌ Failed to fix admin password:', error.message);
  }
  
  process.exit(0);
}

fixAdminPassword();