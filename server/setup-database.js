const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
  console.log('🚀 Setting up ICCA database on Neon...');
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_7gOSZ0desNAz@ep-dawn-lab-adocbyur-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
    ssl: process.env.DATABASE_URL?.includes('neon.tech') ? { rejectUnauthorized: false } : false
  });

  try {
    // Test connection
    console.log('📡 Testing database connection...');
    const client = await pool.connect();
    const result = await client.query('SELECT version()');
    console.log('✅ Connected to PostgreSQL:', result.rows[0].version);
    client.release();

    // Read and execute schema
    console.log('📋 Reading database schema...');
    const schemaPath = path.join(__dirname, 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('🔧 Creating tables and initial data...');
    await pool.query(schema);
    
    console.log('✅ Database setup completed successfully!');
    console.log('');
    console.log('📊 Database Summary:');
    
    // Show created tables
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('📋 Created tables:');
    tables.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });
    
    // Show sample data counts
    const counts = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM users) as users,
        (SELECT COUNT(*) FROM email_templates) as templates,
        (SELECT COUNT(*) FROM template_categories) as categories
    `);
    
    console.log('');
    console.log('📈 Initial data:');
    console.log(`   - Users: ${counts.rows[0].users}`);
    console.log(`   - Templates: ${counts.rows[0].templates}`);
    console.log(`   - Categories: ${counts.rows[0].categories}`);
    
    console.log('');
    console.log('🎉 Your ICCA database is ready!');
    console.log('💡 You can now start the backend server with: npm run dev');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    
    if (error.message.includes('already exists')) {
      console.log('');
      console.log('ℹ️  It looks like the database is already set up.');
      console.log('   If you want to reset it, you can drop the tables first.');
    }
    
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run setup
setupDatabase();