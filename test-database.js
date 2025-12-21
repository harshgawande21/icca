const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_7gOSZ0desNAz@ep-dawn-lab-adocbyur-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: { rejectUnauthorized: false }
});

async function testDatabase() {
  try {
    console.log('🔍 Testing database...');
    
    // Check users
    const users = await pool.query('SELECT email, first_name, last_name, role FROM users');
    console.log('👥 Users in database:');
    users.rows.forEach(user => {
      console.log(`  - ${user.email} (${user.first_name} ${user.last_name}) - ${user.role}`);
    });
    
    // Check templates
    const templates = await pool.query('SELECT COUNT(*) as count FROM email_templates');
    console.log(`📧 Email templates: ${templates.rows[0].count}`);
    
    // Check categories
    const categories = await pool.query('SELECT name FROM template_categories');
    console.log('📂 Categories:');
    categories.rows.forEach(cat => {
      console.log(`  - ${cat.name}`);
    });
    
    console.log('\n✅ Database is working correctly!');
    console.log('🔑 Try logging in with:');
    console.log('   Email: admin@icca.com');
    console.log('   Password: admin123');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
  } finally {
    await pool.end();
  }
}

testDatabase();