import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './src/config/db.js';
import { initDatabase } from './src/db/init-db.js';
import authRoutes from './src/routes/auth.routes.js';
import eventRoutes from './src/routes/event.routes.js';
import rsvpRoutes from './src/routes/rsvp.routes.js';
import { academicBlocks2026 } from './src/config/academicBlocks.js';
import { isDatabaseConnectionError } from './src/config/demoStore.js';

dotenv.config();

const app = express();
const DEFAULT_PORT = Number(process.env.PORT || 5002);
const configuredOrigins = [process.env.CLIENT_URL, process.env.CORS_ORIGINS]
  .filter(Boolean)
  .flatMap((value) => value!.split(','))
  .map((value) => {
    const trimmed = value.trim();
    if (!trimmed) return null;

    try {
      return new URL(trimmed).origin;
    } catch {
      console.warn(`Ignoring invalid CORS origin: ${trimmed}`);
      return null;
    }
  })
  .filter((origin): origin is string => origin !== null);

configuredOrigins.push(
  'https://cs-campus-event-society-hub-oecu.vercel.app',
  'https://cs-campus-event-society-hub-oecu-ci3d3lhqm-portfolio-94e2.vercel.app',
  'https://cs-campus-event-society-hub-zyw6-augf5rds1-portfolio-94e2.vercel.app',
  'https://cs-campus-event-society-hub-1.onrender.com'
);

if (process.env.NODE_ENV !== 'production') {
  configuredOrigins.push(
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:3002',
    'http://127.0.0.1:3003'
  );
}

const allowedOrigins = new Set(configuredOrigins);

const isAllowedOrigin = (origin: string | undefined) => {
  if (!origin) return true;

  try {
    const { hostname, origin: requestOrigin } = new URL(origin);
    const normalizedHostname = hostname.toLowerCase();

    if (allowedOrigins.has(requestOrigin)) {
      return true;
    }

    const hostnameAllowlist = [
      /(^|\.)vercel\.app$/i,
      /(^|\.)onrender\.com$/i,
      /^localhost$/i,
      /^127\.0\.0\.1$/i,
    ];

    if (hostnameAllowlist.some((pattern) => pattern.test(normalizedHostname))) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
};

app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, isAllowedOrigin(origin));
    },
    credentials: true,
    maxAge: 86400,
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

app.get('/api/academic-blocks', (_req, res) => {
  res.json({
    success: true,
    data: academicBlocks2026,
  });
});

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
  } catch (error) {
    if (isDatabaseConnectionError(error)) {
      console.warn('Database unavailable. Starting in demo mode so event discovery remains available.');
    } else {
      console.error('Failed to connect to the database:', error);
      process.exit(1);
    }
  }

  const actualPort = await listenOnAvailablePort(DEFAULT_PORT);
  console.log(`Server running on http://localhost:${actualPort}`);
}

startServer();
