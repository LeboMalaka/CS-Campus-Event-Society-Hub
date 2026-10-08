import { Request, Response, NextFunction } from 'express';
import { verifyToken, UserRole } from '../utils/jwt.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
  };
}

const ADMIN_EMAIL = 'tutu@gmail.com';

export function normalizeRole(role: string | undefined): UserRole {
  const normalized = role?.toLowerCase();
  if (normalized === 'society' || normalized === 'society_admin') {
    return 'society_admin';
  }
  return 'student';
}

function isAllowedSocietyAdmin(email: string | undefined) {
  return typeof email === 'string' && email.trim().toLowerCase() === ADMIN_EMAIL;
}

export function verifyTokenMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'AUTH_REQUIRED',
        message: 'Bearer token is required.',
      },
    });
  }

  try {
    const payload = verifyToken(token);
    req.user = {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Token is invalid or expired.',
      },
    });
  }
}

export function authorizeRole(allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'AUTH_REQUIRED',
          message: 'Authentication required.',
        },
      });
    }

    const normalizedUserRole = normalizeRole(req.user.role);
    if (normalizedUserRole === 'society_admin' && !isAllowedSocietyAdmin(req.user.email)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Only tutu@gmail.com may act as Society Admin.',
        },
      });
    }

    if (!allowedRoles.includes(normalizedUserRole)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: `Forbidden: This action requires one of the following roles: ${allowedRoles.join(', ')}`,
        },
      });
    }

    req.user.role = normalizedUserRole;
    return next();
  };
}

