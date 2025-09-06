// Script to check database configuration
const fs = require('fs');
const path = require('path');

console.log('=== Database Configuration Check ===');

// Check environment variables
console.log('Environment Variables:');
console.log(`- NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`- DATABASE_TYPE: ${process.env.DATABASE_TYPE}`);
console.log(`- DATABASE_URL exists: ${!!process.env.DATABASE_URL}`);
console.log(`- DIRECT_URL exists: ${!!process.env.DIRECT_URL}`);

// Check schema file
const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
if (fs.existsSync(schemaPath)) {
  const schemaContent = fs.readFileSync(schemaPath, 'utf8');
  console.log('\nSchema Provider:');
  
  // Extract provider from schema
  const providerMatch = schemaContent.match(/provider\s*=\s*"([^"]+)"/);
  if (providerMatch) {
    console.log(`- Current provider: ${providerMatch[1]}`);
  } else {
    console.log('- Provider not found in schema');
  }
  
  // Check for directUrl
  const hasDirectUrl = schemaContent.includes('directUrl');
  console.log(`- Has directUrl: ${hasDirectUrl}`);
} else {
  console.log('\nSchema file not found!');
}

// Check available schema files
console.log('\nAvailable Schema Files:');
const prismaDir = path.join(__dirname, '..', 'prisma');
const files = fs.readdirSync(prismaDir);
files.forEach(file => {
  if (file.endsWith('.prisma')) {
    console.log(`- ${file}`);
  }
});

console.log('\n=== End of Configuration Check ===');
