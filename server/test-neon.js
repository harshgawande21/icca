const { Pool } = require('pg');

// Your Neon connection string
const connectionString = 'postgresql://neondb_owner:npg_B1LephX9Frti@ep-old-shape-ad5cypm6-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

async function testConnection() {
  console.log('🔍 Testing Neon PostgreSQL connection...');
  console.log('');
  
  const pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    // Test basic connection
    console.log('📡 Connecting to Neon database...');
    const client = await pool.connect();
    
    // Get database info
    const versionResult = await client.query('SELECT version()');
    const timeResult = await client.query('SELECT NOW()');
    const dbResult = await client.query('SELECT current_database()');
    
    console.log('✅ Connection successful!');
    console.log('');
    console.log('📊 Database Information:');
    console.log(`   Database: ${dbResult.rows[0].current_database}`);
    console.log(`   Time: ${timeResult.rows[0].now}`);
    console.log(`   Version: ${versionResult.rows[0].version.split(' ').slice(0, 2).join(' ')}`);
    
    // Check if tables exist
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('');
    if (tablesResult.rows.length > 0) {
      console.log('📋 Existing tables:');
      tablesResult.rows.forEach(row => {
        console.log(`   - ${row.table_name}`);
      });
    } else {
      console.log('📋 No tables found - database is empty (ready for setup)');
    }
    
    client.release();
    
    console.log('');
    console.log('🎉 Neon database is ready for ICCA!');
    console.log('💡 Next step: Run "npm run setup-db" to initialize the database');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('   1. Check if the connection string is correct');
    console.log('   2. Verify your Neon database is active');
    console.log('   3. Check your internet connection');
    console.log('   4. Ensure SSL is properly configured');
  } finally {
    await pool.end();
  }
}

testConnection();