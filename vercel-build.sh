#!/bin/bash

# Set the database type to PostgreSQL for Vercel deployments
export DATABASE_TYPE=postgresql

# Run the database configuration check before switching
echo "Running database configuration check before switching..."
node scripts/check-db-config.js

# Run the database switching script
echo "Switching to PostgreSQL schema..."
node scripts/switch-db.js postgresql

# Run the database configuration check after switching
echo "Running database configuration check after switching..."
node scripts/check-db-config.js

# Generate Prisma client and build the application
echo "Generating Prisma client..."
npx prisma generate
echo "Building Next.js application..."
npx next build
