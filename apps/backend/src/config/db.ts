import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const isNeonConnection = Boolean(process.env.DATABASE_URL);

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isNeonConnection ? { rejectUnauthorized: false } : false,
});

export default pool;
