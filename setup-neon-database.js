const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database connection
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_7gOSZ0desNAz@ep-dawn-lab-adocbyur-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: { rejectUnauthorized: false }
});

async function setupDatabase() {
  try {
    console.log('🔗 Connecting to Neon database...');
    
    // Test connection
    const testResult = await pool.query('SELECT NOW()');
    console.log('✅ Database connected successfully:', testResult.rows[0].now);
    
    // Read schema file
    const schemaPath = path.join(__dirname, 'server', 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📋 Running database schema...');
    
    // Execute schema
    await pool.query(schema);
    
    console.log('✅ Database schema created successfully!');
    
    // Verify tables were created
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log('📊 Created tables:');
    tablesResult.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
    // Test admin user
    const adminResult = await pool.query('SELECT email, first_name, last_name FROM users WHERE email = $1', ['admin@icca.com']);
    if (adminResult.rows.length > 0) {
      console.log('👤 Admin user created:', adminResult.rows[0]);
    }
    
    // Test templates
    const templatesResult = await pool.query('SELECT COUNT(*) as count FROM email_templates');
    console.log(`📧 Email templates created: ${templatesResult.rows[0].count}`);
    
    console.log('\n🎉 Database setup complete!');
    console.log('🔑 Demo login credentials:');
    console.log('   Email: admin@icca.com');
    console.log('   Password: admin123');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
  } finally {
    await pool.end();
  }
}

setupDatabase();