const fs = require('fs');
const path = require('path');

// Get the database type from command line arguments or environment variable
const databaseType = process.argv[2] || process.env.DATABASE_TYPE || 'sqlite';

// Define paths
const prismaDir = path.join(__dirname, '..', 'prisma');
const schemaPath = path.join(prismaDir, 'schema.prisma');
const sqliteSchemaPath = path.join(prismaDir, 'schema.sqlite.prisma');
const postgresSchemaPath = path.join(prismaDir, 'schema.production.prisma');

// Ensure we have both schema files
if (!fs.existsSync(postgresSchemaPath)) {
  console.error('Error: Production schema file not found at', postgresSchemaPath);
  process.exit(1);
}

// If SQLite schema doesn't exist yet, create a backup of the current schema
if (!fs.existsSync(sqliteSchemaPath) && fs.existsSync(schemaPath)) {
  console.log('Creating SQLite schema backup...');
  fs.copyFileSync(schemaPath, sqliteSchemaPath);
}

// Determine which schema file to use
const sourceSchemaPath = databaseType === 'postgresql' ? postgresSchemaPath : sqliteSchemaPath;

// Copy the appropriate schema file
try {
  console.log(`Switching to ${databaseType} database schema...`);
  fs.copyFileSync(sourceSchemaPath, schemaPath);
  console.log(`Successfully switched to ${databaseType} schema.`);
} catch (error) {
  console.error('Error switching schema:', error);
  process.exit(1);
}
