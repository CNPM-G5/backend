const fs = require('fs');
const path = require('path');
const pool = require('./src/config/db');

async function migrate() {
    try {
        console.log('🔄 Starting database migration...');
        
        // Read schema.sql file
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        // Execute schema
        await pool.query(schema);
        
        console.log('✅ Database migration completed successfully!');
        console.log('📊 Tables created: users, courses, lessons, user_progress');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
    }
}

migrate();
