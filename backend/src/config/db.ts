import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl || databaseUrl.includes('your-neon-host') || databaseUrl.includes('REPLACE_WITH_YOUR_NEON_PASSWORD')) {
  console.error('\n❌ ERROR: Invalid DATABASE_URL in backend/.env');
  console.error('DATABASE_URL still contains placeholder values ("your-neon-host").');
  console.error('Please get your Neon connection string from https://console.neon.tech and update backend/.env\n');
  throw new Error('DATABASE_URL in .env contains placeholder values.');
}

export const sql = neon(databaseUrl);

export const connectDB = async (): Promise<void> => {
  try {
    await sql`CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password TEXT,
      image TEXT,
      role VARCHAR(10) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
      admin_code TEXT,
      google_id TEXT UNIQUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`;

    // Add admin_code column if it doesn't exist yet (for existing databases)
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS admin_code TEXT`;

    await sql`CREATE TABLE IF NOT EXISTS listings (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      seller_name VARCHAR(100) NOT NULL,
      whatsapp VARCHAR(50) NOT NULL,
      state VARCHAR(100) NOT NULL,
      city VARCHAR(100) NOT NULL,
      hair_length NUMERIC NOT NULL CHECK (hair_length BETWEEN 4 AND 60),
      hair_weight NUMERIC NOT NULL CHECK (hair_weight BETWEEN 50 AND 1000),
      hair_type VARCHAR(20) NOT NULL CHECK (hair_type IN ('Straight', 'Wavy', 'Curly', 'Coily')),
      virgin_hair BOOLEAN NOT NULL DEFAULT FALSE,
      description VARCHAR(1000) NOT NULL,
      image_urls TEXT[] NOT NULL DEFAULT '{}',
      cloudinary_public_ids TEXT[] NOT NULL DEFAULT '{}',
      views INTEGER NOT NULL DEFAULT 0,
      status VARCHAR(10) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sold', 'pending', 'rejected')),
      approved BOOLEAN NOT NULL DEFAULT TRUE,
      reported_count INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`;

    await sql`CREATE INDEX IF NOT EXISTS listings_filter_idx ON listings (state, hair_type, approved, status)`;
    await sql`CREATE INDEX IF NOT EXISTS listings_created_idx ON listings (created_at DESC)`;
    
    // Auto-approve any pending listings so sellers can post directly without admin approval
    await sql`UPDATE listings SET approved = TRUE, status = 'active' WHERE status = 'pending' OR approved = FALSE`;
    console.log('Neon database connected & listings auto-approval ensured');
  } catch (error) {
    console.error('Neon database connection failed:', error);
    process.exit(1);
  }
};
