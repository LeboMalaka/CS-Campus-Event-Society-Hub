import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../config/db.js';
import {
  createDemoUser,
  findDemoUserByEmail,
  isDatabaseConnectionError,
} from '../config/demoStore.js';
import { signToken } from '../utils/jwt.js';

const router = Router();

router.post('/register', async (req, res) => {
  const { fullName, displayName, email, password, role } = req.body;
  const normalizedFullName = fullName ?? displayName;
  const normalizedRole = typeof role === 'string' ? role.toLowerCase() : role;

  if (!normalizedFullName || !email || !password || !normalizedRole) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'fullName, email, password, and role are required.',
      },
    });
  }

  if (!['student', 'society'].includes(normalizedRole)) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_ROLE',
        message: 'Role must be either student or society.',
      },
    });
  }

  const existingDemoUser = findDemoUserByEmail(email);
  if (existingDemoUser) {
    return res.status(409).json({
      success: false,
      error: {
        code: 'USER_EXISTS',
        message: 'A user with this email already exists.',
      },
    });
  }

  try {
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);

    if (existing.rowCount && existing.rowCount > 0) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'USER_EXISTS',
          message: 'A user with this email already exists.',
        },
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (display_name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, display_name AS "displayName", email, role, created_at`,
      [normalizedFullName, email, passwordHash, normalizedRole]
    );

    const user = result.rows[0];
    const token = signToken({ id: user.id, email: user.email, role: user.role });

    return res.status(201).json({
      success: true,
      data: {
        user,
        token,
      },
      message: 'User registered successfully.',
    });
  } catch (error) {
    const fallbackUser = findDemoUserByEmail(email);
    if (fallbackUser) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'USER_EXISTS',
          message: 'A user with this email already exists.',
        },
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = createDemoUser({
      display_name: normalizedFullName,
      email,
      password_hash: passwordHash,
      role: normalizedRole,
    });

    const token = signToken({ id: user.id, email: user.email, role: user.role });

    return res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          displayName: user.display_name,
          email: user.email,
          role: user.role,
          created_at: user.created_at,
        },
        token,
      },
      message: 'User registered successfully in demo mode.',
    });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Email and password are required.',
      },
    });
  }

  const demoUser = findDemoUserByEmail(email);
  if (demoUser) {
    const passwordMatches = await bcrypt.compare(password, demoUser.password_hash);
    if (passwordMatches) {
      const token = signToken({
        id: demoUser.id,
        email: demoUser.email,
        role: demoUser.role,
      });

      return res.status(200).json({
        success: true,
        data: {
          user: {
            id: demoUser.id,
            displayName: demoUser.display_name,
            email: demoUser.email,
            role: demoUser.role,
          },
          token,
        },
        message: 'Login successful in demo mode.',
      });
    }
  }

  try {
    const result = await pool.query(
      'SELECT id, display_name, email, password_hash, role FROM users WHERE email = $1',
      [email]
    );

    if (!result.rowCount || result.rowCount === 0) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password.',
        },
      });
    }

    const user = result.rows[0];
    const passwordMatches = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password.',
        },
      });
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          displayName: user.display_name,
          email: user.email,
          role: user.role,
        },
        token,
      },
      message: 'Login successful.',
    });
  } catch (error) {
    if (demoUser) {
      const passwordMatches = await bcrypt.compare(password, demoUser.password_hash);
      if (passwordMatches) {
        const token = signToken({
          id: demoUser.id,
          email: demoUser.email,
          role: demoUser.role,
        });

        return res.status(200).json({
          success: true,
          data: {
            user: {
              id: demoUser.id,
              displayName: demoUser.display_name,
              email: demoUser.email,
              role: demoUser.role,
            },
            token,
          },
          message: 'Login successful in demo mode.',
        });
      }
    }

    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Unable to log in.',
      },
    });
  }
});

export default router;
