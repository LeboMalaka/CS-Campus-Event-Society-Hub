import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './src/config/db.js';
import { initDatabase } from './src/db/init-db.js';
import authRoutes from './src/routes/auth.routes.js';
import eventRoutes from './src/routes/event.routes.js';
import rsvpRoutes from './src/routes/rsvp.routes.js';

dotenv.config();

const app = express();
const DEFAULT_PORT = Number(process.env.PORT || 5002);
const allowedOrigins = new Set([
  process.env.CLIENT_URL,
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'http://127.0.0.1:3002',
  'http://127.0.0.1:3003',
].filter(Boolean));

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('CORS origin not allowed'));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', async (_req, res) => {
  try {
    const result = await pool.query('SELECT NOW() as now');
    res.json({
      success: true,
      message: 'Backend is healthy.',
      database: result.rows[0]?.now,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed.',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/rsvps', rsvpRoutes);

function listenOnAvailablePort(port: number) {
  return new Promise<number>((resolve, reject) => {
    const tryPort = (candidate: number) => {
      const server = app.listen(candidate, () => {
        resolve(candidate);
      });

      server.on('error', (error: NodeJS.ErrnoException) => {
        if (error.code === 'EADDRINUSE') {
          if (candidate >= port + 9) {
            reject(new Error(`No free port found starting from ${port}`));
            return;
          }
          tryPort(candidate + 1);
          return;
        }

        reject(error);
      });
    };

    tryPort(port);
  });
}

async function startServer() {
  try {
    await pool.query('SELECT 1');
    await initDatabase();
    const actualPort = await listenOnAvailablePort(DEFAULT_PORT);
    console.log(`Server running on http://localhost:${actualPort}`);
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  }
}

startServer();
