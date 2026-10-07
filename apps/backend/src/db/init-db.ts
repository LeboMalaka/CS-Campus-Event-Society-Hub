import pg from 'pg';
import dotenv from 'dotenv';
import { categorizeEvent } from '../config/eventCategories.js';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

export async function initDatabase() {
  try {
    console.log('Checking database schema compatibility...');

    const userColumns = await pool.query(
      `SELECT column_name
       FROM information_schema.columns
       WHERE table_schema = 'public' AND table_name = 'users'`
    );

    const eventColumns = await pool.query(
      `SELECT column_name
       FROM information_schema.columns
       WHERE table_schema = 'public' AND table_name = 'events'`
    );

    const userColumnNames = new Set(userColumns.rows.map((row) => row.column_name));
    const eventColumnNames = new Set(eventColumns.rows.map((row) => row.column_name));

    if (!userColumnNames.has('display_name')) {
      await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS display_name VARCHAR(255);`);
      await pool.query(`UPDATE users SET display_name = COALESCE(display_name, full_name, email) WHERE display_name IS NULL;`);
    }

    if (!eventColumnNames.has('creator_id')) {
      await pool.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS creator_id INTEGER;`);
      await pool.query(`UPDATE events SET creator_id = society_id WHERE creator_id IS NULL AND society_id IS NOT NULL;`);
    }

    if (!eventColumnNames.has('start_time')) {
      await pool.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS start_time TIMESTAMPTZ;`);
      await pool.query(`UPDATE events SET start_time = event_date WHERE start_time IS NULL AND event_date IS NOT NULL;`);
    }

    if (!eventColumnNames.has('end_time')) {
      await pool.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS end_time TIMESTAMPTZ;`);
      await pool.query(`UPDATE events SET end_time = end_date WHERE end_time IS NULL AND end_date IS NOT NULL;`);
    }

    if (!eventColumnNames.has('status')) {
      await pool.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS status VARCHAR(30) DEFAULT 'published';`);
      await pool.query(`UPDATE events SET status = 'published' WHERE status IS NULL;`);
    }

    const events = await pool.query('SELECT id, title, description, category FROM events');
    for (const event of events.rows) {
      const category = categorizeEvent(event.title, event.description, event.category);
      if (category !== event.category) {
        await pool.query('UPDATE events SET category = $1 WHERE id = $2', [category, event.id]);
      }
    }

    const birthdayEvent = await pool.query(
      `SELECT id FROM events WHERE title = $1`,
      ["Lebo's birthday celebration"]
    );
    for (const event of birthdayEvent.rows) {
      await pool.query('DELETE FROM rsvps WHERE event_id = $1', [event.id]);
      await pool.query('DELETE FROM events WHERE id = $1', [event.id]);
    }

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_events_creator_id
      ON events (creator_id);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_events_start_time
      ON events (start_time);
    `);

    const count = await pool.query('SELECT COUNT(*)::int AS count FROM users');
    console.log(`Database connected successfully. User count: ${count.rows[0].count}`);
  } catch (error) {
    console.error('Error initializing database schema:', error);
    throw error;
  }
}

export default pool;
